describe('Signup Page', () => {

  beforeEach(() => {
    cy.visit('/signup.php');   // uses baseUrl
  });

  it('allows user to sign up with correct CAPTCHA', () => {

    // Get CAPTCHA text dynamically
    cy.get('.captcha-box')
      .invoke('text')
      .then((captchaText) => {

        cy.get('input[name="username"]').type('testuser');
        cy.get('input[name="password"]').type('Password123!');
        cy.get('input[name="captcha"]').type(captchaText.trim());

        cy.get('button[type="submit"]').click();

        // Should redirect to login page
        cy.url().should('include', 'login.php');
      });

  });

  it('shows error for wrong CAPTCHA', () => {

    cy.get('input[name="username"]').type('wronguser');
    cy.get('input[name="password"]').type('Password123!');
    cy.get('input[name="captcha"]').type('WRONG');

    cy.get('button[type="submit"]').click();

    cy.contains('Incorrect CAPTCHA!');
  });

});

describe('Login Page', () => {

  beforeEach(() => {
    cy.visit('/signup.php');

    // First create account
    cy.get('.captcha-box')
      .invoke('text')
      .then((captchaText) => {

        cy.get('input[name="username"]').type('loginuser');
        cy.get('input[name="password"]').type('Password123!');
        cy.get('input[name="captcha"]').type(captchaText.trim());

        cy.get('button[type="submit"]').click();
      });
  });

  it('logs in successfully with correct details', () => {

    cy.get('input[name="username"]').clear().type('loginuser');
    cy.get('input[name="password"]').clear().type('Password123!');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', 'welcome.php');
    cy.contains('Welcome');
  });

  it('shows error with wrong password', () => {

    cy.get('input[name="username"]').clear().type('loginuser');
    cy.get('input[name="password"]').clear().type('WrongPassword');
    cy.get('button[type="submit"]').click();

    cy.contains('Invalid login details!');
  });

});

describe('Login Validation Tests', () => {

  beforeEach(() => {
    cy.visit('/login.php');
  });

  it('does not allow empty username', () => {
    cy.get('input[name="password"]').type('Password123!');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', 'login.php');
  });

  it('does not allow empty password', () => {
    cy.get('input[name="username"]').type('someuser');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', 'login.php');
  });

});

describe('Case Sensitivity Test', () => {

  it('username is case sensitive on login', () => {

    cy.visit('/signup.php');

    cy.get('.captcha-box')
      .invoke('text')
      .then((captchaText) => {

        cy.get('input[name="username"]').type('CaseUser');
        cy.get('input[name="password"]').type('Password123!');
        cy.get('input[name="captcha"]').type(captchaText.trim());
        cy.get('button[type="submit"]').click();

        // Try different case
        cy.get('input[name="username"]').clear().type('caseuser');
        cy.get('input[name="password"]').clear().type('Password123!');
        cy.get('button[type="submit"]').click();

        cy.contains('Invalid login details!');
      });

  });
describe("Signup → Login → Welcome Flow", () => {

  const username = "loginuser";
  const password = "Password123!";

  it("signs up, logs in, and reaches the welcome page", () => {

    // --- SIGNUP ---
    cy.visit("/signup.php");

    // Get CAPTCHA dynamically
    cy.get('.captcha-box').invoke('text').then((captchaText) => {
      cy.get('input[name="username"]').type(username);
      cy.get('input[name="password"]').type(password);
      cy.get('input[name="captcha"]').type(captchaText.trim());

      cy.get('button[type="submit"]').click();

      // Should redirect to login.php
      cy.url().should('include', 'login.php');

      // --- LOGIN ---
      cy.get('input[name="username"]').clear().type(username);
      cy.get('input[name="password"]').clear().type(password);
      cy.get('button[type="submit"]').click();

      // --- WELCOME ---
      cy.url().should('include', 'welcome.php');
      cy.contains(`Welcome, ${username}`).should('be.visible');
    });
  });

});
});
