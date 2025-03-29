# AI Career Guidance Test Prompts

This document contains structured test prompts for each feature of the Career Guidance system. Each section includes form data requirements and sample prompts.

## 1. General Advice

### Test Prompts

```
"I'm a fresh graduate in computer science, looking to start my career. What should be my first steps?"
"I'm considering switching from marketing to tech. How should I approach this career transition?"
"How do I identify which career path is right for me based on my interests and strengths?"
```

## 2. Skills Analysis

### Form Data Requirements

- Current Skills: Python, SQL, HTML, CSS
- Target Role: Data Scientist
- Experience Level: Entry Level
- Location: United States

### Test Prompts

```
"What key skills am I missing to become a data scientist?"
"Which of my current skills are most valuable for this role and what should I focus on next?"
"How does my skill set compare to typical entry-level data scientists in the US market?"
```

## 3. Salary Insights

### Form Data Requirements

- Job Role: Full Stack Developer
- Location: San Francisco
- Years of Experience: 3
- Key Skills: React, Node.js, MongoDB, AWS

### Test Prompts

```
"What's the typical salary range for someone with my profile?"
"How do my skills affect my market value?"
"What additional skills could help me negotiate a higher salary?"
```

## 4. Portfolio Guide

### Form Data Requirements

- Target Role: Frontend Developer
- Current Skills: HTML, CSS, JavaScript, React
- Experience Level: Mid Level
- Areas of Interest: Web Development, UI/UX, Mobile Apps

### Test Prompts

```
"What types of projects should I include in my portfolio?"
"How can I showcase my React skills effectively?"
"What makes a portfolio stand out for frontend roles?"
```

## 5. Networking Tips

### Form Data Requirements

- Your Name: Ruturaj Amrutkar
- Target Contact Role: Tech Lead
- Shared Interests: AI, Open Source, Tech Education
- Platform: LinkedIn

### Test Prompts

```
"How should I approach this tech lead for mentorship?"
"What's the best way to highlight our shared interests in the initial message?"
"How can I maintain a professional relationship after the first connection?"
```

## 6. Confidence Building

### Form Data Requirements

- Context: Technical Interview
- Past Experiences: "I've had three interviews so far but got nervous during system design discussions. I tend to forget important concepts when under pressure."

### Test Prompts

```
"How can I handle technical questions more confidently?"
"What strategies can help me stay calm during system design discussions?"
"How should I prepare mentally for upcoming interviews?"
```

## 7. Stress Management

### Form Data Requirements

- Current Situation: "Leading my first major project with tight deadlines. Team is understaffed and requirements keep changing."
- Stress Factors: Deadlines, Team Management, Work-Life Balance
- Previous Strategies: Exercise, To-do lists

### Test Prompts

```
"How can I better manage the pressure of leading this project?"
"What are some effective strategies for handling changing requirements?"
"How can I support my team while maintaining my own well-being?"
```

## Testing Guidelines

### Edge Cases to Test

1. Empty Fields

   - Submit forms with missing data
   - Test required vs optional field validation
2. Input Variations

   - Very long inputs (>1000 characters)
   - Special characters and symbols
   - Multi-language inputs
   - Numeric inputs where text is expected and vice versa
3. Response Validation

   - Verify formatting (bold, lists, headers)
   - Check if all form data is referenced in responses
   - Test loading states and error handling
   - Verify response length and structure

### Testing Process

1. Fill out all form fields for the feature being tested
2. Try each suggested prompt
3. Modify prompts slightly to test variations
4. Test edge cases
5. Verify AI response quality and formatting
6. Check error handling and loading states
