import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { connectDB } from "../lib/db";
import Customer from "../models/Customer";
import { faker } from "@faker-js/faker";

const seedData = async () => {
    try {
        await connectDB();
        console.log("Connected to DB, starting to seed...");

        // Ensure we wipe existing dummy data so we don't end up with 1000s of profiles if run multiple times
        // We will just clear the entire collection for a fresh slate
        await Customer.deleteMany({});
        console.log("Cleared existing customers.");

        const profiles = [];
        
        const religions = ["Hindu", "Muslim", "Sikh", "Christian", "Jain", "Buddhist", "Parsi"];
        const castes = ["Brahmin", "Kshatriya", "Vaishya", "Shudra", "Any"];
        const diets = ["Vegetarian", "Non Vegetarian", "Vegan"];
        const smokingDrinking = ["Yes", "No", "Occasionally"];
        const yesNoMaybe = ["Yes", "No", "Maybe"];
        const familyTypes = ["Nuclear", "Joint"];
        const manglikOptions = ["Yes", "No", "Don't Know"];
        const maritalStatuses = ["Never Married", "Divorced", "Widowed"];
        const languages = ["Hindi", "English", "Marathi", "Gujarati", "Bengali", "Tamil", "Telugu", "Kannada", "Malayalam", "Punjabi"];
        const motherTongues = ["Hindi", "English", "Marathi", "Gujarati", "Bengali", "Tamil", "Telugu", "Kannada", "Malayalam", "Punjabi"];

        for (let i = 0; i < 100; i++) {
            const gender = i < 50 ? "Male" : "Female";
            const fakerGender = gender === "Male" ? 'male' : 'female';
            
            const birthdate = faker.date.birthdate({ min: 22, max: 45, mode: 'age' });
            const age = new Date().getFullYear() - birthdate.getFullYear();
            
            profiles.push({
                firstName: faker.person.firstName(fakerGender),
                lastName: faker.person.lastName(fakerGender),
                gender: gender,
                dateOfBirth: birthdate,
                age: age,
                country: "India",
                city: faker.location.city(),
                height: faker.number.int({ min: 150, max: 190 }),
                email: faker.internet.email(),
                phoneNumber: faker.phone.number({ style: 'national' }),
                undergraduateCollege: faker.company.name() + " University",
                degree: faker.helpers.arrayElement(["B.Tech", "B.Com", "B.Sc", "B.A", "BBA", "MBBS"]),
                income: faker.number.int({ min: 500000, max: 5000000 }),
                annualIncome: faker.number.int({ min: 500000, max: 5000000 }),
                currentCompany: faker.company.name(),
                designation: faker.person.jobTitle(),
                maritalStatus: faker.helpers.arrayElement(maritalStatuses),
                siblings: faker.number.int({ min: 0, max: 3 }),
                caste: faker.helpers.arrayElement(castes),
                religion: faker.helpers.arrayElement(religions),
                languagesKnown: faker.helpers.arrayElements(languages, { min: 1, max: 3 }),
                wantKids: faker.helpers.arrayElement(yesNoMaybe),
                openToRelocate: faker.helpers.arrayElement(yesNoMaybe),
                openToPets: faker.helpers.arrayElement(yesNoMaybe),
                statusTag: "New",
                dietPreference: faker.helpers.arrayElement(diets),
                smoking: faker.helpers.arrayElement(smokingDrinking),
                drinking: faker.helpers.arrayElement(smokingDrinking),
                motherTongue: faker.helpers.arrayElement(motherTongues),
                familyType: faker.helpers.arrayElement(familyTypes),
                manglik: faker.helpers.arrayElement(manglikOptions)
            });
        }

        await Customer.insertMany(profiles);
        console.log("Successfully seeded 100 dummy profiles.");
        process.exit();
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
