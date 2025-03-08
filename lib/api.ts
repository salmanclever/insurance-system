// Mock API functions

// In-memory storage for applications
const applications = [
  {
    id: "app123",
    insuranceType: "Health Insurance",
    submittedAt: "2023-09-15T10:30:00Z",
    status: "Approved",
    formData: {
      fullName: "John Doe",
      email: "john@example.com",
      dateOfBirth: "1985-01-15T00:00:00Z",
      hasMedicalConditions: "no",
      coverageType: "premium",
      termsAgreed: true,
    },
  },
  {
    id: "app456",
    insuranceType: "Car Insurance",
    submittedAt: "2023-09-10T14:20:00Z",
    status: "Pending",
    formData: {
      fullName: "Jane Smith",
      email: "jane@example.com",
      vehicleMake: "Toyota",
      vehicleModel: "Camry",
      vehicleYear: 2020,
      purchaseDate: "2020-03-15T00:00:00Z",
      drivingHistory: "no",
      coverageType: "comprehensive",
      termsAgreed: true,
    },
  },
  {
    id: "app789",
    insuranceType: "Home Insurance",
    submittedAt: "2023-09-05T09:15:00Z",
    status: "Rejected",
    formData: {
      fullName: "Robert Johnson",
      email: "robert@example.com",
      address: "123 Main St, Anytown, USA",
      propertyType: "house",
      yearBuilt: 1995,
      purchaseDate: "2010-06-22T00:00:00Z",
      hasSecuritySystem: "no",
      coverageAmount: 350000,
      termsAgreed: true,
    },
  },
  {
    id: "app101",
    insuranceType: "Life Insurance",
    submittedAt: "2023-08-28T16:45:00Z",
    status: "Approved",
    formData: {
      fullName: "Emily Davis",
      email: "emily@example.com",
      dateOfBirth: "1978-05-22T00:00:00Z",
      smoker: "no",
      familyHistory: "No significant medical history",
      beneficiaryName: "Michael Davis",
      beneficiaryRelationship: "Spouse",
      coverageAmount: 500000,
      termsAgreed: true,
    },
  },
  {
    id: "app202",
    insuranceType: "Travel Insurance",
    submittedAt: "2023-08-20T11:10:00Z",
    status: "Pending",
    formData: {
      fullName: "Michael Wilson",
      email: "michael@example.com",
      destination: "Japan",
      tripDuration: 14,
      tripStartDate: "2023-12-10T00:00:00Z",
      tripEndDate: "2023-12-24T00:00:00Z",
      travelPurpose: "leisure",
      preExistingConditions: "no",
      termsAgreed: true,
    },
  },
]

// Fetch insurance types
export async function fetchInsuranceTypes() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    { id: "health", name: "Health Insurance" },
    { id: "home", name: "Home Insurance" },
    { id: "car", name: "Car Insurance" },
    { id: "life", name: "Life Insurance" },
    { id: "travel", name: "Travel Insurance" },
  ]
}

// Fetch form structure based on insurance type
export async function fetchFormStructure(insuranceType: string) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800))

  const formStructures: Record<string, any> = {
    health: {
      title: "Health Insurance Application",
      fields: [
        {
          id: "fullName",
          type: "text",
          label: "Full Name",
          placeholder: "Enter your full name",
          required: true,
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          placeholder: "Enter your email",
          required: true,
        },
        {
          id: "dateOfBirth",
          type: "date",
          label: "Date of Birth",
          required: true,
        },
        {
          id: "hasMedicalConditions",
          type: "radio",
          label: "Do you have any pre-existing medical conditions?",
          required: true,
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
        },
        {
          id: "medicalConditionsDetails",
          type: "textarea",
          label: "Please describe your medical conditions",
          placeholder: "Enter details here",
          required: true,
          condition: {
            dependsOn: "hasMedicalConditions",
            value: "yes",
          },
        },
        {
          id: "coverageType",
          type: "select",
          label: "Coverage Type",
          required: true,
          options: [
            { label: "Basic", value: "basic" },
            { label: "Standard", value: "standard" },
            { label: "Premium", value: "premium" },
          ],
        },
        {
          id: "termsAgreed",
          type: "checkbox",
          label: "Terms and Conditions",
          placeholder: "I agree to the terms and conditions",
          required: true,
        },
      ],
    },
    home: {
      title: "Home Insurance Application",
      fields: [
        {
          id: "fullName",
          type: "text",
          label: "Full Name",
          placeholder: "Enter your full name",
          required: true,
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          placeholder: "Enter your email",
          required: true,
        },
        {
          id: "address",
          type: "text",
          label: "Property Address",
          placeholder: "Enter property address",
          required: true,
        },
        {
          id: "propertyType",
          type: "select",
          label: "Property Type",
          required: true,
          options: [
            { label: "House", value: "house" },
            { label: "Apartment", value: "apartment" },
            { label: "Condo", value: "condo" },
            { label: "Townhouse", value: "townhouse" },
          ],
        },
        {
          id: "yearBuilt",
          type: "number",
          label: "Year Built",
          placeholder: "Enter year built",
          required: true,
          min: 1900,
          max: new Date().getFullYear(),
        },
        {
          id: "purchaseDate",
          type: "date",
          label: "Purchase Date",
          required: true,
        },
        {
          id: "hasSecuritySystem",
          type: "radio",
          label: "Do you have a security system?",
          required: true,
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
        },
        {
          id: "securitySystemDetails",
          type: "textarea",
          label: "Security System Details",
          placeholder: "Describe your security system",
          condition: {
            dependsOn: "hasSecuritySystem",
            value: "yes",
          },
        },
        {
          id: "coverageAmount",
          type: "number",
          label: "Coverage Amount ($)",
          placeholder: "Enter coverage amount",
          required: true,
          min: 50000,
        },
        {
          id: "termsAgreed",
          type: "checkbox",
          label: "Terms and Conditions",
          placeholder: "I agree to the terms and conditions",
          required: true,
        },
      ],
    },
    car: {
      title: "Car Insurance Application",
      fields: [
        {
          id: "fullName",
          type: "text",
          label: "Full Name",
          placeholder: "Enter your full name",
          required: true,
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          placeholder: "Enter your email",
          required: true,
        },
        {
          id: "vehicleMake",
          type: "text",
          label: "Vehicle Make",
          placeholder: "e.g., Toyota, Honda",
          required: true,
        },
        {
          id: "vehicleModel",
          type: "text",
          label: "Vehicle Model",
          placeholder: "e.g., Camry, Civic",
          required: true,
        },
        {
          id: "vehicleYear",
          type: "number",
          label: "Vehicle Year",
          placeholder: "Enter vehicle year",
          required: true,
          min: 1950,
          max: new Date().getFullYear() + 1,
        },
        {
          id: "purchaseDate",
          type: "date",
          label: "Purchase Date",
          required: true,
        },
        {
          id: "drivingHistory",
          type: "radio",
          label: "Have you had any accidents in the last 3 years?",
          required: true,
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
        },
        {
          id: "accidentDetails",
          type: "textarea",
          label: "Accident Details",
          placeholder: "Describe the accidents",
          condition: {
            dependsOn: "drivingHistory",
            value: "yes",
          },
        },
        {
          id: "coverageType",
          type: "select",
          label: "Coverage Type",
          required: true,
          options: [
            { label: "Liability Only", value: "liability" },
            { label: "Collision", value: "collision" },
            { label: "Comprehensive", value: "comprehensive" },
          ],
        },
        {
          id: "termsAgreed",
          type: "checkbox",
          label: "Terms and Conditions",
          placeholder: "I agree to the terms and conditions",
          required: true,
        },
      ],
    },
    life: {
      title: "Life Insurance Application",
      fields: [
        {
          id: "fullName",
          type: "text",
          label: "Full Name",
          placeholder: "Enter your full name",
          required: true,
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          placeholder: "Enter your email",
          required: true,
        },
        {
          id: "dateOfBirth",
          type: "date",
          label: "Date of Birth",
          required: true,
        },
        {
          id: "smoker",
          type: "radio",
          label: "Are you a smoker?",
          required: true,
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
        },
        {
          id: "familyHistory",
          type: "textarea",
          label: "Family Medical History",
          placeholder: "Describe any relevant family medical history",
          required: true,
        },
        {
          id: "beneficiaryName",
          type: "text",
          label: "Beneficiary Name",
          placeholder: "Enter beneficiary's full name",
          required: true,
        },
        {
          id: "beneficiaryRelationship",
          type: "text",
          label: "Relationship to Beneficiary",
          placeholder: "e.g., Spouse, Child",
          required: true,
        },
        {
          id: "coverageAmount",
          type: "number",
          label: "Coverage Amount ($)",
          placeholder: "Enter coverage amount",
          required: true,
          min: 10000,
        },
        {
          id: "termsAgreed",
          type: "checkbox",
          label: "Terms and Conditions",
          placeholder: "I agree to the terms and conditions",
          required: true,
        },
      ],
    },
    travel: {
      title: "Travel Insurance Application",
      fields: [
        {
          id: "fullName",
          type: "text",
          label: "Full Name",
          placeholder: "Enter your full name",
          required: true,
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          placeholder: "Enter your email",
          required: true,
        },
        {
          id: "destination",
          type: "text",
          label: "Destination Country",
          placeholder: "Enter destination country",
          required: true,
        },
        {
          id: "tripDuration",
          type: "number",
          label: "Trip Duration (days)",
          placeholder: "Enter number of days",
          required: true,
          min: 1,
          max: 365,
        },
        {
          id: "tripStartDate",
          type: "date",
          label: "Trip Start Date",
          required: true,
        },
        {
          id: "tripEndDate",
          type: "date",
          label: "Trip End Date",
          required: true,
        },
        {
          id: "travelPurpose",
          type: "select",
          label: "Purpose of Travel",
          required: true,
          options: [
            { label: "Leisure", value: "leisure" },
            { label: "Business", value: "business" },
            { label: "Study", value: "study" },
            { label: "Medical", value: "medical" },
          ],
        },
        {
          id: "preExistingConditions",
          type: "radio",
          label: "Do you have any pre-existing medical conditions?",
          required: true,
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
        },
        {
          id: "medicalDetails",
          type: "textarea",
          label: "Medical Condition Details",
          placeholder: "Describe your medical conditions",
          condition: {
            dependsOn: "preExistingConditions",
            value: "yes",
          },
        },
        {
          id: "termsAgreed",
          type: "checkbox",
          label: "Terms and Conditions",
          placeholder: "I agree to the terms and conditions",
          required: true,
        },
      ],
    },
  }

  return formStructures[insuranceType] || { fields: [] }
}

// Submit application
export async function submitApplication(applicationData: any) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Generate a random ID
  const id = Math.random().toString(36).substring(2, 10)

  // Get insurance type name from ID
  const insuranceTypes = await fetchInsuranceTypes()
  const insuranceType =
    insuranceTypes.find((type) => type.id === applicationData.insuranceType)?.name || applicationData.insuranceType

  // Create new application
  const newApplication = {
    id,
    insuranceType,
    submittedAt: new Date().toISOString(),
    status: "Pending",
    formData: applicationData.formData,
  }

  // Add to in-memory applications array
  applications.unshift(newApplication)

  // Return the created application
  return newApplication
}

// Fetch applications
export async function fetchApplications() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 700))

  // Return applications from in-memory storage
  return applications
}

// Fetch application by ID
export async function fetchApplicationById(id: string) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300))

  return applications.find((app) => app.id === id) || null
}

// Generate application PDF (mock)
export async function generateApplicationPDF(application: any): Promise<Buffer> {
  // Simulate PDF generation
  await new Promise((resolve) => setTimeout(resolve, 1200))

  // In a real implementation, you would use a library like PDFKit or jsPDF
  // to generate the PDF document based on the application data.

  // For this mock, we'll just return a simple PDF buffer.
  const pdfContent = `
    Application ID: ${application.id}
    Insurance Type: ${application.insuranceType}
    Submitted At: ${application.submittedAt}
    Status: ${application.status}
    Form Data: ${JSON.stringify(application.formData, null, 2)}
  `

  const pdfBuffer = Buffer.from(pdfContent)
  return pdfBuffer
}

