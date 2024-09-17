/// <reference types="cypress" />
describe('Emotor ', () => {
    it('Create A trip', () => {
      cy.visit('http://localhost:3000/');
   
      cy.get('[class="btn-get-started"]').click();
      cy.wait(2000);
      cy.get('input[type=file]').selectFile('cypress/img/WPCBC-3448.jpg', {force:true});
      cy.wait(8000);
      cy.get('#vehicle_usage').select('Hiring');
      cy.get('[id="seatingcapacity"]').type('5');
      cy.get('[id="marketValue"]').type('2500000');
      cy.get('[id="checkdata"]').click()
      cy.get('[class="get-submit-button"]').click();
      cy.wait(2000);
      cy.get('[class="cta-btn motorgurd"]').click();
      cy.wait(2000);
      cy.get('[id="fname"]').type('test_ui');
      cy.get('[id="lname"]').type('test');
      cy.get('[id="nic"]').type('961587255V');
      cy.get('[id="address"]').type('Kelaniya');
      cy.get('[id="email"]').type('nuwanthikshana@gmail.com');
      cy.get('[id="contact_no"]').type('0773256692');
      cy.get('[id="checkdata"]').click()
      cy.get('[class="get-submit-button"]').click();
      cy.wait(2000);
      cy.get('[class="get-submit-button mt-3"]').click();
      cy.wait(5000);
      cy.get('[id="cardholdername"]').type('N T W Athukorala');
      cy.get('[id="cardNumber"]').type('4284170047174008');
      cy.get('[id="expiry"]').type('07/26');
      cy.get('[id="cvc"]').type('585');
      cy.wait(2000);
      cy.get('[class="get-submit-button mt-3"]').click();
      cy.wait(2000);
    //   cy.get('[placeholder="Enter OTP"]').type('5850');
      cy.get('[type="submit"]').click();
      cy.wait(2000);
    //   cy.wait(2000);
    //   cy.get('[placeholder="Password"]').type('Sanith@123');
   
    //   cy.wait(2000);
    //   cy.get('[class="ant-btn ant-btn-primary login-form-button"]').click();
   
    //   cy.wait(2000);
    //   cy.get('[class="ant-btn ant-btn-primary ant-btn-lg plan-button"]').click();
   
    //   // Where do you want to go?
    //   cy.wait(2000);
    //   cy.get('[class="ant-select-selection-search-input"]').click();
    //   cy.get('[class="ant-select-item ant-select-item-option ant-select-item-option-active"]').click();
    //   cy.get('[class="ant-select-selector"]').should('have.text', 'Kandy');
   
    //   // Trip Dates
    //   // Select the start date
    //   cy.wait(2000);
    //   // cy.get('[placeholder="Start date"]').click().type('2024-09-01');
    //   cy.get('[placeholder="Start date"]').click();
    //   cy.get('.ant-picker-cell-inner').contains('10').click();
   
    //   // Select the end date
    //   cy.wait(2000);
    //   // cy.get('[placeholder="End date"]').click().type('2024-09-10').type('{enter}');
    //   cy.get('.ant-picker-cell-inner').contains('12').click();
   
    //   // Select your preferences/interests
    //   cy.wait(2000);
    //   cy.get('[class="ant-tag interest-tag "]').eq(0).click();
    //   cy.get('[class="ant-tag interest-tag "]').eq(4).click();
   
    //   // Budget
    //   cy.wait(2000);
    //   cy.get('.ant-slider.ant-slider-horizontal.ant-slider-with-marks').click('center');
   
    //   // Age Category
    //   cy.wait(2000);
    //   cy.get('input[type="radio"]').eq(1).check().should('be.checked');
   
    //   // Gender
    //   cy.wait(2000);
    //   cy.get('input[type="radio"]').eq(4).check().should('be.checked');
   
    //   // Traveler Category
    //   cy.wait(2000);
    //   cy.get('input[type="radio"]').eq(7).check().should('be.checked');
   
    //   cy.wait(2000);
    //   cy.get('[type="button"]').eq(0).click();
   
    //   cy.wait(2000);
   
    //   // landing Screen
    //   cy.get('[class="city-name"]').should('have.text', 'Kandy');
   
    //   cy.wait(3000);
   
    //   //accommoadtions click
    //   cy.get('div[role="tab"]').contains('Accommodations').click();
   
    //   cy.wait(1000);
   
    //   // cy.get('#rc-tabs-0-panel-3')
    //   //   .should('be.visible');
   
    //   cy.get('#rc-tabs-0-panel-3').find('button.ant-btn.ant-btn-primary').click();
   
    //   cy.wait(3000);
   
    //   cy.get('.ant-modal').should('be.visible');
   
    //   cy.get('.ant-collapse-content.ant-collapse-content-active').should('be.visible');
   
    //   cy.get('.hotel-cards').find('.ant-card').first().find('.ant-card-cover').find('.heart-icon').click();
   
    //   cy.get('.ant-modal-footer').find('button.ant-btn.ant-btn-primary').contains('OK').click();
   
    //   cy.get('.content-part.top-part').find('.header-buttons').find('button.ant-btn').eq(1).click();
   
    //   cy.get('.ant-modal').should('be.visible');
   
    //   cy.get('.ant-modal-body').find('input.ant-input[placeholder="Enter Trip Name"]').type('Wander through Kandy');
   
    //   cy.get('.ant-modal-footer').find('button.ant-btn.ant-btn-primary').contains('Save Trip').click();
   
    //   cy.get('[class="ant-dropdown-trigger ant-dropdown-link profile_btn"]').click();
   
    //   cy.get('.ant-dropdown-menu').find('li').first().click();
   
    //   cy.wait(2000);
   
    //   cy.url().should('include', '/trips');
   
    //   cy.get('.card-container')
    //     .find('.ant-card')
    //     .first()
    //     .find('.ant-card-body')
    //     .find('.ant-card-meta-title')
    //     .should('contain.text', 'Wander through Kandy');
     });
  });