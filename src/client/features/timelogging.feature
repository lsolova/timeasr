Feature: Timeasr measurement
    As a user of Timeasr
    I want to measure my worktime
    
    Scenario: Start measurement
        Given I am visiting the Timeasr page
        When I click on the element with id "#counterValue"
        Then an entry with name "startOn" is in the localStorage
    
    Scenario: Stop measurement
        Given I am visiting the Timeasr page
        When an entry with name "startOn" is in the localStorage
        And I click on the element with id "#counterValue"
        Then an entry with name "startOn" is not in the localStorage
        And an entry with name "currentDate" and value "0" is in the localStorage
