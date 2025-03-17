# Habit Tracker - React & Appwrite
[Project](https://habit-tracker-react-appwrite.vercel.app/)
## Overview

Habit Tracker is a simple yet powerful application designed to help users build and track their habits over time. Inspired by the GitHub commit system, this app visualizes your daily progress by marking each day you successfully complete a habit. The app is built using **React** for the frontend and **Appwrite** for the backend, including authentication and database management.

With this app, you can:
- Create and manage habits.
- Track your daily progress for each habit.
- Visualize your streak and commitment over time.
- Securely authenticate using Appwrite's email/password authentication.

---

## Features

### Frontend (React)
- **Habit Creation**: Add new habits with a name.
- **Daily Tracking**: Mark each day you complete a habit, similar to GitHub's commit grid.
- **Progress Visualization**: View your habit streaks and progress over time in a calendar-like view.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

### Backend (Appwrite)
- **Authentication**: Secure user authentication using Appwrite's email/password system.
- **Database**: Store user habits and daily progress in Appwrite's database.
---


## Technologies Used

- **Frontend**:
  - React (JavaScript/JSX) Converted to (TypeScript/TSX)
  - CSS (Tailwind CSS for styling)
  - Tanstack Query

- **Backend**:
  - Appwrite (Authentication, Database, Storage)
  - Appwrite SDK for React

- **Other Tools**:
  - React Router for navigation
  - React Icons for icons

---

## Installation

### Prerequisites
- Node.js and npm installed on your machine.
- An Appwrite project set up with:
  - Authentication enabled (email/password).
  - A database collection for storing habits and progress.

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/habit-tracker.git
   cd habit-tracker
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
5. **Run the Application**:
   ```bash
   npm run dev
   ```
---

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes.
4. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Inspired by GitHub's commit system.
- Built with [React](https://reactjs.org/) and [Appwrite](https://appwrite.io/).

---

Happy habit tracking! 🚀
