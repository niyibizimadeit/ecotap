"# NFC Business Card Platform

## System Design and Product Specification

### Abstract

This document presents the system design and product specification for an NFC-enabled digital business card platform. The platform bridges physical NFC cards with cloud-hosted digital employee profiles, enabling instant contact exchange between employees and visitors without requiring either party to install a dedicated application.

## 1. Introduction

This platform combines NFC hardware with a centralised web-based management system, allowing a company to issue physical cards to all employees while maintaining full administrative control over digital profiles from a single dashboard. The result is a scalable, low-friction networking tool that creates a persistent digital record of every contact exchange.

## 2. Product Vision

The platform is designed around a single, illustrative deployment scenario: a company with many employees, each issued one physical NFC business card. When a visitor taps any employee card with a smartphone, the following sequence is initiated automatically:

- The employee's digital profile opens instantly on the visitor's device.
- The visitor may view the employee's contact information and professional details.
- The visitor may save the employee's contact directly to their phone.
- The visitor may submit their own contact information in return.

Both parties retain each other's contact details, completing a digital networking exchange.

The company administrator manages the entire employee card portfolio from one central platform. No mobile application installation is required on the part of the visitor. The system operates entirely through the smartphone's default NFC reader and a standard web browser.

## 3. User Roles and Permissions

The system defines exactly three user types. Each role carries a distinct set of permissions commensurate with its function within the networking lifecycle.

### 3.1 Company Administrator

The Administrator role is typically fulfilled by a member of the Human Resources, Marketing, or Management function. The Administrator holds full system-level control and is responsible for the operational integrity of the platform. Administrator capabilities include:

- Creating and removing employee accounts
- Viewing and auditing all employee digital cards
- Managing company branding (logos, colour schemes, contact details)
- Configuring company-wide information displayed across all cards

### 3.2 Employee

Each employee is provisioned with a personal account upon creation by the Administrator. Employees exercise autonomy over their own profile and may not access or modify the profiles of other employees. Employee capabilities include:

- Uploading a profile photograph
- Updating phone number and email address
- Authoring a professional biography or 'About' section
- Selecting card colour themes and display preferences
- Sharing their digital card link directly

### 3.3 Visitor

The Visitor is any person who scans or accesses an employee's card. No account registration is required. Visitor capabilities are intentionally limited to the networking transaction itself:

- Viewing an employee's public digital profile
- Saving the employee's contact to their device
- Exchanging their own contact details with the employee
- Sharing the employee's profile link with a third party

## 4. User Journey

The following outlines the end-to-end user journey from employee creation to a completed digital contact exchange.

### Step 1: Employee Creation

The Administrator creates an employee record (e.g. John Smith, Sales Manager). The system automatically generates a unique public URL: `companycards.com/john-smith`

### Step 2: Card Provisioning

The generated URL is encoded into both an NFC chip and a QR code. These are embedded in the employee's physical card.

### Step 3: Card Scan

A visitor taps the NFC card. Their phone's browser opens the public profile page, displaying name, title, contact links, and action buttons.

### Step 4: Contact Exchange

The visitor taps 'Exchange Contact' and submits their name, phone number, and email address.

### Step 5: Mutual Connection

Both parties now hold each other's contact details. The employee receives the visitor's submission in their dashboard with timestamp.

## 5. Minimum Viable Product Feature Set

The following features constitute the first release.

### 5.1 Authentication

Secure login sessions for both Administrator and Employee roles. Visitor access to public card pages requires no authentication.

### 5.2 Employee Profile

Each employee profile stores the following data fields:

- Full name and position title
- Department
- Phone number and email address
- Profile photograph
- Biography / About section
- Social media links (LinkedIn, WhatsApp, etc.)

### 5.3 Digital Business Card (Public Page)

A publicly accessible web page rendered at each employee's unique URL. The page displays the employee's profile information, company branding, and the following action buttons: Save Contact and Exchange Contact.

### 5.4 Save Contact

A single-click action that generates and downloads a `.vcf` (vCard) file, which is natively recognised by iOS and Android contact applications and saved directly to the device's address book.

### 5.5 Contact Exchange

A form allowing the visitor to submit their name, phone number, and email address. Upon submission, the employee receives a timestamped entry in their dashboard containing the visitor's details.

### 5.6 QR Code Generation

A QR code is automatically generated for every employee and encodes their unique profile URL. The QR code may be printed on physical materials, embedded in email signatures, or included in company brochures.

### 5.7 NFC Support

Each employee's NFC chip is programmed with a single URL pointing to their public profile page. No custom NFC application logic is required; the chip simply triggers the device's default browser to open the designated URL.

### 5.8 Theme Customisation

Employees may personalise the appearance of their digital card within a defined set of options, preserving individual expression while maintaining corporate visual standards.

- Card colour palette: Blue, Green, Black, Red, Purple
- Display mode: Light Theme or Dark Theme
- Accent colour: Applied to buttons and interactive highlights

## 6. Dashboard Structure

### 6.1 Administrator Dashboard

The Administrator dashboard provides system-wide visibility and control, with the following primary navigation sections:

- Dashboard — Overview statistics and activity summary
- Employees — Create, edit, and remove employee accounts
- Departments — Organise employees by department grouping
- Company Settings — Configure branding, contact information, and platform preferences
- Analytics — View card interaction data and contact exchange metrics

### 6.2 Employee Dashboard

The Employee dashboard provides profile management and networking history, with the following primary navigation sections:

- My Profile — View current card as visitors see it
- Edit Card — Update all profile fields and biographical content
- Theme Settings — Adjust card colour and display preferences
- Contact Exchanges — Review all received visitor contacts with timestamps
- QR code — Download and share the employee's generated QR code

