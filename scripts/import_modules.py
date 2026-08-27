import json
import re
from pathlib import Path
from docx import Document

SOURCE = Path('/workspace/scratch/90e9922d6c85/hse-content-source')
OUTPUT = Path(__file__).resolve().parents[1] / 'src' / 'data' / 'modules.json'


def clean_option(text):
    return re.sub(r'^[A-D][.][ ]*', '', text).strip()


def parse_inline_questions(paragraphs, prefix):
    questions = []
    i = 0
    while i < len(paragraphs):
        text, style = paragraphs[i]
        if style == 'Heading 3' and re.match(r'^(Question[ ]+\d+|\d+[.])', text):
            prompt = re.sub(r'^(Question[ ]+\d+|\d+[.])[ ]*', '', text).strip()
            if not prompt and i + 1 < len(paragraphs):
                i += 1
                prompt = paragraphs[i][0]
            options = []
            answer_letter = None
            explanation = ''
            i += 1
            while i < len(paragraphs):
                value, value_style = paragraphs[i]
                if value_style == 'Heading 3' and re.match(r'^(Question[ ]+\d+|\d+[.])', value):
                    break
                match = re.match(r'^([A-D])[.][ ]*(.+)', value)
                if match:
                    options.append(match.group(2).strip())
                elif value.lower().startswith('correct answer:'):
                    answer_letter = value.split(':', 1)[1].strip()[:1]
                elif value.lower().startswith('explanation:'):
                    explanation = value.split(':', 1)[1].strip()
                i += 1
            if len(options) == 4:
                questions.append({
                    'id': f'{prefix}-q{len(questions)+1}',
                    'prompt': prompt,
                    'options': options,
                    'correctIndex': ord(answer_letter or 'A') - ord('A'),
                    'explanation': explanation,
                })
            continue
        i += 1
    return questions


def parse_module(path, module_number):
    document = Document(path)
    paragraphs = [(p.text.strip(), p.style.name) for p in document.paragraphs if p.text.strip()]
    module_title = paragraphs[2][0].split(':', 1)[1].strip()
    overview_index = next(i for i, (t, s) in enumerate(paragraphs) if t == 'Module Overview')
    description = paragraphs[overview_index + 1][0]
    lesson_starts = [i for i, (t, s) in enumerate(paragraphs) if s == 'Heading 1' and re.match(r'^Lesson \d+:', t)]
    assessment_start = next(i for i, (t, s) in enumerate(paragraphs) if s == 'Heading 1' and re.match(r'^Module \d+ Final Assessment$', t))
    key_start = next(i for i, (t, s) in enumerate(paragraphs) if s == 'Heading 1' and t == 'Final Assessment Answer Key')

    lessons = []
    for position, start in enumerate(lesson_starts):
        end = lesson_starts[position + 1] if position + 1 < len(lesson_starts) else assessment_start
        title_line = paragraphs[start][0]
        match = re.match(r'^Lesson (\d+): (.+)$', title_line)
        order, title = int(match.group(1)), match.group(2)
        body = paragraphs[start + 1:end]
        time_text = next((t for t, _ in body if t.lower().startswith('estimated time:')), 'Estimated time: 10 minutes')
        numbers = [int(n) for n in re.findall(r'\d+', time_text)]
        estimated = round(sum(numbers[:2]) / min(2, len(numbers))) if numbers else 10
        questions = parse_inline_questions(body, f'f-m{module_number}-l{order}')

        sections = []
        current = {'heading': 'Lesson Content', 'points': []}
        for text, style in body:
            if text.lower().startswith('estimated time:'):
                continue
            if style == 'Heading 3' and re.match(r'^Question \d+', text):
                break
            if style == 'Heading 2':
                if current['points']:
                    sections.append(current)
                current = {'heading': text, 'points': []}
            elif not re.match(r'^[A-D][.]', text) and not text.lower().startswith(('correct answer:', 'explanation:')):
                current['points'].append(text)
        if current['points']:
            sections.append(current)
        summary = next((s['points'][0] for s in sections if s['heading'] == 'Lesson Summary' and s['points']), description)
        lessons.append({
            'id': f'f-m{module_number}-l{order}', 'order': order, 'title': title,
            'estimatedMinutes': estimated, 'summary': summary,
            'contentStatus': 'ready', 'sections': sections, 'questions': questions,
        })

    answers = {}
    for text, _ in paragraphs[key_start + 1:]:
        match = re.match(r'^(\d+)[.]\s*([A-D])\s*-\s*(.+)', text)
        if match:
            answers[int(match.group(1))] = (match.group(2), match.group(3))
        elif answers:
            break
    exam_block = paragraphs[assessment_start + 1:key_start]
    exam_questions = parse_inline_questions(exam_block, f'f-m{module_number}-exam')
    for index, question in enumerate(exam_questions, 1):
        letter, answer_text = answers.get(index, ('A', ''))
        question['correctIndex'] = ord(letter) - ord('A')
        question['explanation'] = f'Correct answer: {answer_text}'

    return {
        'id': f'foundation-module-{module_number}', 'order': module_number,
        'level': 'foundation', 'title': module_title, 'description': description,
        'passingScore': 80, 'lessons': lessons, 'finalAssessment': exam_questions,
    }


modules = [parse_module(SOURCE / f'HSE_Mentor_Module_{n}.docx', n) for n in range(1, 6)]
OUTPUT.write_text(json.dumps(modules, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Wrote {OUTPUT}: {sum(len(m["lessons"]) for m in modules)} lessons, '
      f'{sum(sum(len(l["questions"]) for l in m["lessons"]) for m in modules)} practice questions, '
      f'{sum(len(m["finalAssessment"]) for m in modules)} exam questions')
