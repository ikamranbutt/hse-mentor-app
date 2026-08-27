# HSE Mentor

Cloud-buildable learning app. No Android Studio is required.

## Current scope

- Foundation catalog: 5 modules and 50 lessons
- Responsive mobile interface
- Browser/PWA build
- Automatic Android debug APK through GitHub Actions
- Automatic browser preview through GitHub Pages

## GitHub-only setup

1. Create a free empty GitHub repository.
2. Upload all files from this project, including the `.github` folder.
3. Commit to the `main` branch.
4. Open **Actions**, choose **Build Android APK**, and run the workflow.
5. Download `HSE-Mentor-Android-APK` from the completed workflow.
6. For browser preview, enable GitHub Pages with **GitHub Actions** as the source.

The current APK is a test/debug build. Play Store AAB signing will be added as a separate controlled step so the permanent upload key is preserved securely.

## Content data model

`src/data/catalog.ts` defines modules and lesson order. Full lesson bodies and question banks will be imported from the approved Module 1-5 master documents in the next content-import step.
