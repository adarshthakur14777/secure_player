# **App Name**: WhisperShare

## Core Features:

- Secure Admin Login: Admin authentication via a login page at /admin/login, secured with static credentials.
- Admin Dashboard: Dashboard at /admin to upload audio, view files, generate links, and monitor activity.
- Link Generation: Generate unique, single-use links for each audio file with quantity selection and link management within the admin dashboard.
- Activity Logging: Log right-click events on the audio player on the playback page to monitor potential misuse.
- Audio Playback: Public audio playback page at /play/{unique_link_id} with a simple player, disabled download options, and a warning against unauthorized recording.

## Style Guidelines:

- Primary color: Forest Green (#228B22) to evoke a sense of security and naturalness related to the audio content being protected.
- Background color: Very light green (#F0FFF0), nearly white, creating a clean, unobtrusive backdrop that ensures readability.
- Accent color: Earthy Brown (#B8860B) for interactive elements, providing contrast and visual interest, and complementing the green tones.
- Font pairing: 'Inter' (sans-serif) for both headlines and body text, offering a clean and modern look.
- Use a modern icon set, like Bootstrap Icons, for all action buttons to enhance usability.
- Employ a card-based layout with generous padding and whitespace for a clean, modern aesthetic.
- Implement subtle animations, such as fade-ins and transitions, to improve the user experience.