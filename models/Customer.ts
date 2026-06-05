import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
    {
        // Personal Details

        firstName: {
            type: String,
            required: true,
        },

        lastName: {
            type: String,
            required: true,
        },

        gender: {
            type: String,
            enum: ["Male", "Female"],
            required: true,
        },

        dateOfBirth: Date,

        age: Number,

        // Location

        country: String,

        city: String,

        // Physical

        height: Number,

        // Contact

        email: String,

        phoneNumber: String,

        // Education

        undergraduateCollege: String,

        degree: String,

        // Career

        income: Number,

        currentCompany: String,

        designation: String,

        // Family

        maritalStatus: {
            type: String,
            enum: [
                "Never Married",
                "Divorced",
                "Widowed"
            ],
        },

        siblings: Number,

        // Cultural

        caste: String,

        religion: String,

        languagesKnown: [String],

        // Preferences

        wantKids: {
            type: String,
            enum: ["Yes", "No", "Maybe"],
        },

        openToRelocate: {
            type: String,
            enum: ["Yes", "No", "Maybe"],
        },

        openToPets: {
            type: String,
            enum: ["Yes", "No", "Maybe"],
        },

        // Dashboard Status

        statusTag: {
            type: String,
            enum: [
                "New",
                "Active",
                "Matched",
                "Meeting Scheduled",
                "Closed"
            ],
            default: "Active",
        },

        // Assigned Matchmaker

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        dietPreference: {
            type: String,
            enum: [
                "Vegetarian",
                "Non Vegetarian",
                "Vegan"
            ]
        },

        smoking: {
            type: String,
            enum: ["Yes", "No", "Occasionally"]
        },

        drinking: {
            type: String,
            enum: ["Yes", "No", "Occasionally"]
        },

        motherTongue: String,

        annualIncome: Number,

        familyType: {
            type: String,
            enum: [
                "Nuclear",
                "Joint"
            ]
        },

        manglik: {
            type: String,
            enum: [
                "Yes",
                "No",
                "Don't Know"
            ]
        }
    },
    { timestamps: true }
);

export default mongoose.models.Customer ||
    mongoose.model("Customer", CustomerSchema);