#! usr/bin/env node
import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";
// Customer Class
class Customer {
    firstName: string;
    lastName: string;
    age: number;
    mobNumber: string;
    accNumber: number;
    gender: string;
    constructor (fName:string,
        lName:string,
        age:number,
        mob:string,
        acc:number,
        gender:string
    ) {
        this.firstName = fName;
        this.lastName =lName;
        this.age = age;
        this.mobNumber = mob;
        this.accNumber = acc;
        this.gender = gender;
      }
}
// Interface BankAccount
interface BankAccount {
    accNumber : number,
    balance : number,
}
// Class Bank
class Bank {
    customer : Customer [] = [];
    account : BankAccount [] = [];
    addCustomer(obj:Customer){
        this.customer.push(obj);
    }
    addAccountNumber(obj:BankAccount){
        this.account.push(obj);
    }
    // New method to update balance
    updateBalance(accNumber: number, amount: number) {
        const account = this.account.find(acc => acc.accNumber === accNumber);
        if (account) {
            account.balance += amount;
        }
    }
}
let myBank = new Bank();
// console.log(myBank);
// Customer Create
for(let i:number = 1; i <=5; i++ ){
let fName = faker.person.firstName('male');
let lName = faker.person.lastName();
/* Different Method:
let num = parseInt(faker.phone.number("03########"));
let num = faker.phone.number("###-###-####");
let num = faker.phone.number();
let num = faker.helpers.fromRegExp(/^[1-9]{1}[0-9]{9}$/);*/
let num = faker.string.numeric(10);
const cus = new Customer(fName,lName,20 * i , num , 1000+i,"male");
myBank.addCustomer(cus);
myBank.addAccountNumber({accNumber: cus.accNumber,balance:10000 * i});
// for check coding = console.log(cus);
}
// for check coding = console.log(mybank);
// Bank Functionality
async function bankService(bank:Bank) {
    let service = await inquirer.prompt({
        type:"list",
        name:"select",
        message:"Please Select the Service",
        choices:["View Balance","Cash Withdraw","Cash Deposit"]
    });
// View Balance
    if(service.select == "View Balance"){
        let res = await inquirer.prompt({
            type:"input",
            name:"accNumber",
            message:"Please Enter the Account Number:",
        });
        let account = myBank.account.find((acc)=> acc.accNumber == res.accNumber)
        if(!account){
            console.log(chalk.red.bold("Invalid the Account Number"));
        }
        if (account){
            let name = myBank.customer.find((item)=>item.accNumber==account?.accNumber);
            console.log(`Dear ${chalk.green.italic(name?.firstName)}${chalk.green.italic(name?.lastName)} your Account Balance is ${chalk.blueBright(`$${account.balance}`)}`);
        }
    };
   // Cash Withdraw
   if (service.select == "Cash Withdraw") {
    let res = await inquirer.prompt([
        {
            type: "input",
            name: "accNumber",
            message: "Please Enter the Account Number:",
        },
        {
            type: "input",
            name: "amount",
            message: "Enter the amount to withdraw:",
        }
    ]);
    let account = myBank.account.find((acc) => acc.accNumber == parseInt(res.accNumber));
    if (!account) {
        console.log(chalk.red.bold("Invalid Account Number"));
    } else if (account.balance < res.amount) {
        console.log(chalk.red.bold("Insufficient Balance"));
    } else {
        myBank.updateBalance(account.accNumber, -res.amount);
        console.log(chalk.green.bold(`Withdrawal Successful! Your new balance is $${account.balance}`));
    }
}
// Cash Deposit
if (service.select == "Cash Deposit") {
    let res = await inquirer.prompt([
        {
            type: "input",
            name: "accNumber",
            message: "Please Enter the Account Number:",
        },
        {
            type: "input",
            name: "amount",
            message: "Enter the amount to deposit:",
        }
    ]);
    let account = myBank.account.find((acc) => acc.accNumber == parseInt(res.accNumber));
    if (!account) {
        console.log(chalk.red.bold("Invalid Account Number"));
    } else {
        myBank.updateBalance(account.accNumber, res.amount);
        console.log(chalk.green.bold(`Deposit Successful! Your new balance is $${account.balance}`));
    }
}
}
bankService(myBank);
