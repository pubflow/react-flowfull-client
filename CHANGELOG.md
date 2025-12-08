# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-12-08

### 🆕 Added
- **Bridge Payments Support**: Integrated `@pubflow/core` v0.4.0 with complete Bridge Payments client
  - Payment processing with Stripe, PayPal, Authorize.net
  - Payment intents, methods, and subscriptions management
  - Organization and multi-tenant support
  - Guest checkout with token authentication
- **Updated Dependencies**:
  - `@pubflow/core`: ^0.2.0 → ^0.4.0
  - `@pubflow/react`: ^0.3.4-beta.1 → ^0.4.1

### 📚 Documentation
- Added links to official documentation:
  - Flowless: https://flowless.dev/
  - Flowfull Clients: https://clients.flowfull.dev/
  - Bridge Payments: https://bridgepayments.dev/
- Updated README with new features and version information

### 🔄 Changed
- Starter kit version bumped to 0.2.0 to reflect major dependency updates

## [0.1.0] - Initial Release

### Added
- Initial project setup with TanStack Start
- Pubflow React integration
- Complete authentication system
- Professional UI components with Shadcn
- Dynamic theming and branding
- Offline support
- Protected routes
- Advanced data management components
- Debug tools for development

### Features
- User authentication with Flowless
- Bridge API integration
- BridgeList, BridgeTable, BridgeForm components
- Advanced filtering and search
- Responsive design system
- TypeScript support
- Tailwind CSS styling

---

**Legend:**
- 🆕 **Added** - New features
- 🔄 **Changed** - Changes in existing functionality
- 🗑️ **Deprecated** - Soon-to-be removed features
- ❌ **Removed** - Removed features
- 🐛 **Fixed** - Bug fixes
- 🔒 **Security** - Security improvements

