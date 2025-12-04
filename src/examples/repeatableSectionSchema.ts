import type { FormSchema } from "../form-engine/types/index.js";

/**
 * Repeatable Section Example - Form Array
 *
 * এই example এ repeatable sections ব্যবহার করা হয়েছে।
 * একাধিক experiences, education, skills ইত্যাদি যোগ করতে পারবেন।
 *
 * This example demonstrates repeatable sections (Form Array).
 * You can add multiple experiences, education, skills, etc.
 */

export const repeatableSectionSchema: FormSchema = {
  sections: [
    {
      title: "Basic Information",
      description: "Your personal details",
      fields: [
        {
          name: "fullName",
          label: "Full Name",
          type: "text",
          placeholder: "Enter your full name",
          cols: 1,
          validation: {
            required: true,
            minLength: 3,
          },
        },
        {
          name: "email",
          label: "Email",
          type: "text",
          placeholder: "your.email@example.com",
          cols: 1,
          validation: {
            required: true,
            email: true,
          },
        },
        {
          name: "phone",
          label: "Phone Number",
          type: "text",
          placeholder: "+880 1XXX-XXXXXX",
          cols: 2,
          validation: {
            required: "Phone number is required",
          },
        },
      ],
    },
    {
      title: "Work Experience",
      description: "Add your professional work experience",
      repeatable: true,
      repeatableConfig: {
        addButtonText: "➕ Add Experience",
        removeButtonText: "✕ Remove",
        minItems: 1,
        maxItems: 10,
      },
      fields: [
        {
          name: "companyName",
          label: "Company Name",
          type: "text",
          placeholder: "Enter company name",
          cols: 1,
          validation: {
            required: "Company name is required",
          },
        },
        {
          name: "position",
          label: "Position/Title",
          type: "text",
          placeholder: "e.g., Senior Software Engineer",
          cols: 1,
          validation: {
            required: "Position is required",
          },
        },
        {
          name: "startDate",
          label: "Start Date",
          type: "date",
          cols: 1,
          validation: {
            required: "Start date is required",
          },
        },
        {
          name: "endDate",
          label: "End Date",
          type: "date",
          cols: 1,
        },
        {
          name: "currentlyWorking",
          label: "Current Job",
          type: "checkbox",
          checkboxLabel: "I currently work here",
          cols: 2,
          defaultValue: false,
        },
        {
          name: "responsibilities",
          label: "Key Responsibilities",
          type: "text",
          placeholder: "Describe your main responsibilities",
          cols: 2,
        },
      ],
    },
    {
      title: "Education",
      description: "Add your educational background",
      repeatable: true,
      repeatableConfig: {
        addButtonText: "➕ Add Education",
        removeButtonText: "✕ Remove",
        minItems: 1,
        maxItems: 5,
      },
      fields: [
        {
          name: "institutionName",
          label: "Institution Name",
          type: "text",
          placeholder: "University/College name",
          cols: 1,
          validation: {
            required: "Institution name is required",
          },
        },
        {
          name: "degree",
          label: "Degree",
          type: "text",
          placeholder: "e.g., Bachelor of Science",
          cols: 1,
          validation: {
            required: "Degree is required",
          },
        },
        {
          name: "fieldOfStudy",
          label: "Field of Study",
          type: "text",
          placeholder: "e.g., Computer Science",
          cols: 1,
        },
        {
          name: "graduationYear",
          label: "Graduation Year",
          type: "number",
          placeholder: "2020",
          min: 1950,
          max: 2030,
          cols: 1,
          validation: {
            required: "Graduation year is required",
          },
        },
        {
          name: "grade",
          label: "Grade/CGPA",
          type: "text",
          placeholder: "e.g., 3.8/4.0",
          cols: 2,
        },
      ],
    },
    {
      title: "Skills",
      description: "Add your technical and soft skills",
      repeatable: true,
      repeatableConfig: {
        addButtonText: "➕ Add Skill",
        removeButtonText: "✕ Remove",
        minItems: 0,
        maxItems: 20,
      },
      fields: [
        {
          name: "skillName",
          label: "Skill Name",
          type: "text",
          placeholder: "e.g., React, TypeScript, Leadership",
          cols: 1,
          validation: {
            required: "Skill name is required",
          },
        },
        {
          name: "proficiency",
          label: "Proficiency Level",
          type: "select",
          placeholder: "Select proficiency",
          cols: 1,
          options: [
            { label: "Beginner", value: "beginner" },
            { label: "Intermediate", value: "intermediate" },
            { label: "Advanced", value: "advanced" },
            { label: "Expert", value: "expert" },
          ],
          validation: {
            required: "Proficiency level is required",
          },
        },
        {
          name: "yearsOfExperience",
          label: "Years of Experience",
          type: "number",
          placeholder: "e.g., 3",
          min: 0,
          max: 50,
          cols: 2,
        },
      ],
    },
    {
      title: "Projects",
      description: "Showcase your best projects",
      repeatable: true,
      repeatableConfig: {
        addButtonText: "➕ Add Project",
        removeButtonText: "✕ Remove",
        minItems: 0,
        maxItems: 10,
      },
      fields: [
        {
          name: "projectName",
          label: "Project Name",
          type: "text",
          placeholder: "Enter project name",
          cols: 1,
          validation: {
            required: "Project name is required",
          },
        },
        {
          name: "projectType",
          label: "Project Type",
          type: "radio",
          cols: 1,
          options: [
            { label: "Personal", value: "personal" },
            { label: "Professional", value: "professional" },
            { label: "Academic", value: "academic" },
          ],
          validation: {
            required: "Project type is required",
          },
        },
        {
          name: "technologies",
          label: "Technologies Used",
          type: "select",
          placeholder: "Select technologies",
          isMulti: true,
          cols: 2,
          options: [
            { label: "React", value: "react" },
            { label: "TypeScript", value: "typescript" },
            { label: "Node.js", value: "nodejs" },
            { label: "Python", value: "python" },
            { label: "MongoDB", value: "mongodb" },
            { label: "PostgreSQL", value: "postgresql" },
          ],
        },
        {
          name: "projectDescription",
          label: "Project Description",
          type: "text",
          placeholder: "Describe the project",
          cols: 2,
        },
        {
          name: "projectUrl",
          label: "Project URL",
          type: "text",
          placeholder: "https://example.com",
          cols: 2,
          validation: {
            pattern: {
              value: /^https?:\/\/.+/,
              message: "Please enter a valid URL",
            },
          },
        },
      ],
    },
  ],
};
