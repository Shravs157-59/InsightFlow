# Modern To-Do List Application

## Overview

This is a modern, responsive To-Do List web application built with Flask and vanilla JavaScript. The application provides a clean, user-friendly interface for task management with features like filtering, sorting, searching, and local storage persistence. The design emphasizes a modern blue color scheme with smooth animations and responsive layout.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Template Engine**: Flask's Jinja2 templating system for server-side rendering
- **CSS Framework**: Bootstrap 5 for responsive grid system and base components
- **Custom Styling**: CSS custom properties (CSS variables) for consistent theming with a light blue color palette
- **JavaScript**: Vanilla ES6+ JavaScript with class-based architecture for client-side functionality
- **State Management**: Browser localStorage for task persistence across sessions
- **Icons**: Font Awesome 6 for consistent iconography
- **Typography**: Google Fonts (Inter) for modern, clean typography

### Backend Architecture
- **Web Framework**: Flask (Python) with minimal routing structure
- **Application Structure**: Simple single-module Flask app with separation of concerns
- **Session Management**: Flask sessions with configurable secret key
- **Development Configuration**: Debug mode enabled with host binding for development
- **Static File Serving**: Flask's built-in static file handling for CSS/JS assets

### Client-Side Features
- **Task Management**: Object-oriented JavaScript class (TodoApp) handling all task operations
- **Data Persistence**: localStorage-based persistence without server-side database
- **User Interface**: Dynamic task rendering, filtering, sorting, and search functionality
- **Responsive Design**: Mobile-first approach using Bootstrap's responsive grid system
- **Visual Feedback**: CSS transitions and animations for smooth user interactions

### Design Patterns
- **MVC Pattern**: Clear separation between presentation (templates), logic (JavaScript classes), and styling (CSS)
- **Progressive Enhancement**: Base HTML structure enhanced with JavaScript functionality
- **Component-Based CSS**: Modular CSS with custom properties for maintainable theming
- **Event-Driven Architecture**: JavaScript event listeners handling user interactions

## External Dependencies

### CDN-Based Dependencies
- **Bootstrap 5.3.0**: CSS framework for responsive design and UI components
- **Font Awesome 6.4.0**: Icon library for task-related and UI icons
- **Google Fonts (Inter)**: Typography system for consistent font rendering across browsers

### Python Dependencies
- **Flask**: Lightweight WSGI web application framework
- **Standard Library**: os, logging modules for configuration and debugging

### Browser APIs
- **localStorage**: Client-side storage for task persistence
- **DOM APIs**: Modern JavaScript DOM manipulation without external libraries
- **CSS Custom Properties**: Modern CSS variables for dynamic theming
