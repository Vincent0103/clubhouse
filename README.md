# The Clubhouse

## Description

This project is part of The Odin Project course. The Clubhouse is an exclusive members-only message board where users can write posts and view them based on their membership status. Non-members can see posts but with hidden author information, while members can see full details. The application features user authentication, role-based permissions, and admin capabilities for content management.

## Features

- **User Authentication**: Secure registration and login system using Passport.js with bcrypt password hashing for enhanced security.

- **Role-Based Access Control**: Three distinct user roles - Regular users, Club members, and Administrators - each with different levels of access and privileges.

- **Message Board System**: Users can create, view, and manage posts. Content visibility depends on membership status, creating an exclusive community experience.

- **Admin Panel**: Administrative users can delete inappropriate content and manage the community through a dedicated interface with confirmation modals.

- **Responsive Design**: Mobile-first responsive design with a hamburger menu and adaptive layouts that work seamlessly across all devices.

- **Modern UI/UX**: Clean, professional interface built with Tailwind CSS, featuring smooth animations, hover effects, and intuitive navigation.

- **Security Features**: Input validation and sanitization using Express Validator, XSS protection, and secure session management.

- **Database Integration**: PostgreSQL database with Supabase for reliable data storage and management of users, posts, and relationships.

## Technologies Used

- **Backend**: Node.js with Express.js framework
- **Database**: PostgreSQL with Supabase
- **Authentication**: Passport.js with Local Strategy
- **Template Engine**: EJS for server-side rendering
- **Styling**: Tailwind CSS for responsive design
- **Validation**: Express Validator for input sanitization
- **Security**: bcryptjs for password hashing
- **Icons**: Lucide for consistent iconography
- **Session Management**: Express Session

## File Structure

```
src/
├── controllers/          # Route handlers and business logic
│   ├── login/           # Login-specific controllers
│   ├── indexController.js
│   ├── registerController.js
│   └── deleteMessageController.js
├── db/                  # Database configuration and queries
│   ├── queries.js
│   └── supabaseClient.js
├── routes/              # Express route definitions
├── views/               # EJS templates
│   ├── partials/        # Reusable template components
│   └── *.ejs
├── utils/               # Utility functions and error handling
└── app.js               # Main application entry point

public/
├── js/                  # Client-side JavaScript
├── css/                 # Stylesheets and assets
└── imgs/                # Image assets
```

## Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/Vincent0103/clubhouse.git
cd clubhouse
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in `.env`:
```env
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. Run the application:
```bash
npm start
```

## Database Schema

The application uses PostgreSQL with the following main tables:
- **USER**: Stores user information, roles, and authentication data
- **MESSAGE**: Contains posts with relationships to users
- Proper foreign key relationships and constraints for data integrity

## Security Considerations

- **Password Security**: All passwords are hashed using bcrypt before storage
- **Input Validation**: All user inputs are validated and sanitized
- **Session Security**: Secure session management with proper configuration
- **Role-Based Access**: Different permission levels prevent unauthorized actions
- **XSS Protection**: Template escaping and input sanitization prevent cross-site scripting

## User Roles

1. **Regular Users**: Can view posts (with limited author information) and create accounts
2. **Club Members**: Can see full post details including author information and join exclusive discussions
3. **Administrators**: Full access including content moderation and user management capabilities

## License

This project is licensed under the MIT License.

## Acknowledgements

- [The Odin Project](https://www.theodinproject.com/) for providing comprehensive full-stack development curriculum and project guidelines.
- [Supabase](https://supabase.com/) for providing robust PostgreSQL database hosting and management tools.
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework enabling rapid UI development.
- [Lucide](https://lucide.dev/) for the beautiful and consistent icon library used throughout the application.
