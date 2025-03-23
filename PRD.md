# [Health Objective Assistant] PRD

## Overview
- **Project Description**  
  A Next.js web application with a Flask backend that helps users define and track health objectives and make better day-to-day food choices. It leverages an LLM for interactive guidance and an image recognition service for scanning food items.

## User Requirements
- **User Personas**  
  1. **Health Enthusiast**: Wants general guidance for a healthier lifestyle (e.g., losing weight, building muscle).  
  2. **Diet-Constrained Individual**: Has a specific dietary restriction or allergy (e.g., gluten-free, seafood allergy).  
  3. **Medical Condition Manager**: Needs to track specific metrics (e.g., blood sugar, cholesterol) to comply with medical advice.

- **User Stories**  
  1. *As a Health Enthusiast*, I want to define my weight-loss goals in a simple manner so the app can provide diet recommendations.  
  2. *As a Diet-Constrained Individual*, I want to scan a food item’s image and know immediately if it violates my restrictions.  
  3. *As a Medical Condition Manager*, I want to input my latest lab values (or upload test results) so the system can refine its dietary advice.

## Technical Requirements
- **Architecture**  
  1. **Frontend**: Next.js deployed on Vercel.  
  2. **Backend**: Flask (could be deployed on Heroku or similar).  
  3. **Local Data Storage**: All user objectives, metrics, and scanned items stored in browser storage (no external database).  
  4. **LLM Integration**: A dedicated endpoint in the Flask backend to communicate with an LLM API. The LLM should present pre-written or “canned” answers whenever relevant to speed up the conversation, while still allowing for custom responses when necessary.

- **APIs**  
  1. **POST /api/orchestrate**
     - **Purpose**: A single orchestration endpoint that receives all messages (define objective, define health profile, collect health metrics, or scan food), categorizes the request, and routes it to the correct internal agent. The orchestrator then forwards the agent’s response back to the client.

     - **Input**:
       - `conversation`: Array of message objects representing the ongoing dialogue between the user and the system.
         - Each message includes at least a `role` (e.g., `user`, `assistant`) and `content` (the text of the message).
       - `userProfile`: The current user profile, if any.
       - `objective`: The user’s objective (if relevant).
       - Optionally, additional fields (e.g., attachments for images) depending on the request.

     - **Output**:
       - The response will vary depending on which internal agent is invoked. It can include:
         - `updatedConversation`: Updated array of messages (if the agent involves a back-and-forth chat).
         - `objective`: The finalized or partial objective (if this is a define-objective flow).
         - `updatedUserProfile`: If the agent modifies or adds metrics to the user profile.
         - `result`: If the request involved scanning food to see if it’s allowed.

     - **Behavior**:
       - Receives the request.
       - Infers the category of the request from the conversation/context.
       - Routes the request data (conversation, userProfile, etc.) to the correct internal agent.
       - Receives the result from the agent.
       - Returns a consolidated response that includes the agent’s output.

     - **Example Data Structures**:
       **Input**:
       ```json
       {
         "conversation": [
           { "role": "user", "content": "I’d like to set a weight-loss goal." }
         ],
         "userProfile": {},
         "agentType": "defineObjective"
       }
       ```
       **Output**:
       ```json
       {
         "updatedConversation": [
           { "role": "user", "content": "I’d like to set a weight-loss goal." },
           { "role": "assistant", "content": "Great! How much weight would you like to lose?" }
         ],
         "objective": "",
         "updatedUserProfile": {},
         "result": null
       }
       ```     
  
  2. **Define-Objective Agent**
   - **Purpose**: Guide the user through a conversational process to create and finalize a **new** health objective (e.g., lose weight, avoid certain allergens, manage blood sugar). The agent asks probing questions until the objective is clear and actionable.
   - **Input**:
     - `conversation`: Array of message objects representing the current conversation (user messages, LLM responses, etc.).
   - **Output**:
     - `updatedConversation`: Updated array of messages including the LLM’s newest reply.
     - `objective`: The finalized objective once all clarifications are gathered (up to 5–6 questions).
   - **Example Data Structures**:
     **Input**:
     ```json
     {
       "conversation": [
         { "role": "user", "content": "I want to lose weight." },
         { "role": "assistant", "content": "Can you describe your current diet?" }
       ],
       "objective": ""
     }
     ```
     **Output**:
     ```json
     {
       "updatedConversation": [
         { "role": "user", "content": "I want to lose weight." },
         { "role": "assistant", "content": "Can you describe your current diet?" },
         { "role": "assistant", "content": "(New LLM response)" }
       ],
       "objective": "Lose 10 lbs in 3 months"
     }
     ```

  3. **Define-Health-Profile Agent**
   - **Purpose**: Determine which health metrics will be needed later to support the newly defined objective. This agent does not fill in values yet—only outlines the metrics or placeholders that should be collected in the subsequent **Collect-Health-Metrics** step.
   - **Input**:
     - `objective`: The user’s finalized objective.
     - `userProfile`: The current user profile object (may be empty if new).
   - **Output**:
     - `updatedUserProfile`: Contains newly added metrics (with empty or placeholder values) that are relevant to the objective but not yet filled in.
   - **Behavior**: Merges or updates the user profile with any placeholder metrics needed for the new objective. If an existing metric already covers the new objective, it’s not duplicated.
   - **Example Data Structures**:
     **Input**:
     ```json
     {
       "objective": "Lose 10 lbs in 3 months",
       "userProfile": {
         "metrics": [
           {
             "name": "allergies",
             "value": "peanuts",
             "objectives": ["avoid allergens"]
           }
         ]
       }
     }
     ```
     **Output**:
     ```json
     {
       "updatedUserProfile": {
         "metrics": [
           {
             "name": "allergies",
             "value": "peanuts",
             "objectives": ["avoid allergens"]
           },
           {
             "name": "targetWeight",
             "value": "",
             "objectives": ["Lose 10 lbs in 3 months"]
           },
           {
             "name": "dailyCaloricIntake",
             "value": "",
             "objectives": ["Lose 10 lbs in 3 months"]
           },
           {
             "name": "weeklyExerciseMinutes",
             "value": "",
             "objectives": ["Lose 10 lbs in 3 months"]
           }
         ]
       }
     }
     ```

  4. **Collect-Health-Metrics Agent**
   - **Purpose**: Engage the user in a step-by-step conversation to gather additional health-related data (metrics) from **text input only**. The user can provide textual information about their diet, known allergies, lab results (in text form), etc.
   - **Input**:
     - `conversation`: The ongoing conversation, including the user’s latest text message.
     - `objective`: The user’s objective.
     - `userProfile`: The current user profile.
   - **Output**:
     - `updatedConversation`: The conversation with the LLM’s newest response.
     - `updatedUserProfile`: Updated with any new metrics gleaned from the conversation.
   - **Behavior**: Asks targeted questions to fill in any missing metrics relevant to the objective, interpreting user text to populate or update the user profile.
   - **Example Data Structures**:
     **Input**:
     ```json
     {
       "conversation": [
         { "role": "user", "content": "My blood sugar is 180 mg/dL." }
       ],
       "objective": "Manage diabetes",
       "userProfile": {
         "metrics": []
       }
     }
     ```
     **Output**:
     ```json
     {
       "updatedConversation": [
         { "role": "user", "content": "My blood sugar is 180 mg/dL." },
         { "role": "assistant", "content": "Let’s record your blood sugar as 180 mg/dL." }
       ],
       "updatedUserProfile": {
         "metrics": [
           {
             "name": "bloodSugar",
             "value": "180 mg/dL",
             "objectives": ["Manage diabetes"]
           }
         ]
       }
     }
     ```

  5. **Scan-Food Agent**
   - **Purpose**: Determine whether a specific food item (provided via text or image) aligns with the user’s objectives and metrics. The agent identifies the food content and decides if it’s allowed or not, providing explanations.
   - **Input**:
     - `conversation`: The ongoing conversation, possibly including a text description or image of the food.
     - `userProfile`: The current user profile.
   - **Output**:
     - `updatedConversation`: The conversation with the LLM’s or image recognition result appended.
     - `result`: An object containing `{ isAllowed: boolean, reason: string }`.
   - **Behavior**: Identifies the food item and evaluates it against the user’s objectives and metrics to determine whether it is suitable.
   - **Example Data Structures**:
     **Input**:
     ```json
     {
       "conversation": [
         { "role": "user", "content": "Can I eat this pizza?" }
       ],
       "userProfile": {
         "metrics": [
           {
             "name": "allergies",
             "value": "gluten",
             "objectives": ["Avoid gluten"]
           }
         ]
       }
     }
     ```
     **Output**:
     ```json
     {
       "updatedConversation": [
         { "role": "user", "content": "Can I eat this pizza?" },
         { "role": "assistant", "content": "This pizza contains gluten." }
       ],
       "result": {
         "isAllowed": false,
         "reason": "It contains gluten, which you are allergic to."
       }
     }
     ```
  2. **POST /api/image-scan**
     - **Purpose**: An endpoint for uploading an image (e.g., a food item or lab test image) and returning a detailed description of its contents. This endpoint uses an image recognition service or LLM-based computer vision to interpret the image. It then decides which internal agent to call (if relevant) or simply returns the recognized details.  
     - **Request Body**: `{ imageFile: binary or base64, ... }` plus any additional information required to handle the request.  
     - **Response**: `{ status: 'success', description: string, ... }`, which can include recognized text or details gleaned from the image. If the user’s request requires further logic (e.g., scanning food for dietary restrictions), the endpoint may coordinate with the orchestration agent and respond accordingly.

- **Data Models**  
  1. **Objective**  
     - **Description**: A short statement of the user’s goal or constraint (e.g., “Lose 10 lbs in 3 months”).  
  2. **User Metrics**  
     - **Description**: Various metrics relevant to one or more objectives (e.g., weight, allergies, specific lab values).  
     - **Source**: Free text input, images/PDFs of lab reports.  
     - **Objective Associations**: Each metric should store a reference to the objective(s) it covers. If a user deletes an objective, any metrics used **exclusively** by that objective should also be removed from the profile.  
  3. **Scanned Food Item**  
     - **Description**: Analyzed result of the image recognition and LLM classification, saved locally for future reference.  
     - **Fields**:  
       - Name/Label (optional if recognized)  
       - Date/Time of scan  
       - Outcome (“Good” or “Bad”)  
       - Reason (e.g., “Contains seafood, violates allergy objective”)  

- **Security**  
  1. No centralized database or authentication – user data is stored locally in the browser.  
  2. SSL/TLS (HTTPS) should be enforced for all communications with the backend.  
  3. Minimizing personally identifiable information (PII) storage and ensuring ephemeral handling of uploaded images.

## Design Requirements
- **UI/UX Guidelines**  
  1. **Conversational Flow**: A single-screen interface with a chat box for both day-to-day use and creating new objectives.  
  2. **Visual Feedback**: Playful animations and sounds for scanning results:  
     - “Good Item” → celebratory animation and positive sound.  
     - “Bad Item” → buzzer sound and “X” mark or red overlay.  
  3. **Minimal UI**: Focus on clarity and ease of use, with short instructions or prompts at each step.

- **Single Screen Layout**  
  1. **Objectives List**: A list of current objectives at the top, each with an option to delete.  
  2. **Add Objective Button**: Triggers the new objective flow within the same chat box.  
  3. **Chat Box**: Central area for user-LLM interactions, including:  
     - Creating/refining new objectives.  
     - Daily conversation (e.g., “Can I buy this?”, “Can I eat that?”).  
     - Image scanning interactions.  
  4. **Scanned Items History**:  
     - A section (or list) in the same interface showing previously scanned items, their “good” or “bad” status, and the reason linked to the user’s objectives.  
     - User can review past scans at any time.

## Plan
- **Phases**  
  1. **Definition & Setup**  
  2. **Objective Configuration**  
  3. **Daily Use Features**  
  4. **Deployment & Testing**

### Phase 1: Definition & Setup
- **Step 1**: Project Kickoff
  - [ ] **Task**: Initialize Next.js project  
  - [ ] **Task**: Initialize Flask backend project  
  - [ ] **Task**: Set up local storage utilities for browser

- **Step 2**: Basic Architecture & Endpoints  
  - [ ] **Task**: Create `/api/define-objective` endpoint skeleton in Flask  
  - [ ] **Task**: Create `/api/chat` endpoint skeleton in Flask  
  - [ ] **Task**: Create `/api/scan-food` endpoint skeleton in Flask  

### Phase 2: Objective Configuration
- **Step 1**: LLM Chat Integration  
  - [ ] **Task**: Implement front-end chat UI for the user’s objective definition flow  
  - [ ] **Task**: Connect chat UI to `/api/chat` for LLM guidance  
  - [ ] **Task**: Store refined objectives and metrics in browser storage

- **Step 2**: User Metrics Capture  
  - [ ] **Task**: Create simple UI to manually enter user metrics  
  - [ ] **Task**: Add option to upload files (images/PDFs) for metrics  
  - [ ] **Task**: Ensure these details are passed to LLM for guidance

### Phase 3: Daily Use Features
- **Step 1**: Food Scanning  
  - [ ] **Task**: Implement image upload or camera capture in front-end  
  - [ ] **Task**: Integrate with an image recognition service (via `/api/scan-food`)  
  - [ ] **Task**: Display real-time feedback with animations/sounds based on scanning result  
  - [ ] **Task**: Save scanned item details (name/label if available, date/time, outcome, reason) in local storage

- **Step 2**: Continuous LLM Guidance  
  - [ ] **Task**: Allow the user to chat with the LLM for daily check-ins or meal advice  
  - [ ] **Task**: Provide an option to update objectives or metrics if needed  
  - [ ] **Task**: Display a history of scanned items with their outcomes and reasons

### Phase 4: Deployment & Testing
- **Step 1**: Deployment Setup  
  - [ ] **Task**: Deploy Next.js to Vercel  
  - [ ] **Task**: Deploy Flask backend (e.g., Heroku or similar)  
  - [ ] **Task**: Configure environment variables (API keys, etc.) for LLM integration

- **Step 2**: QA & Feedback Loop  
  - [ ] **Task**: Conduct end-to-end testing on objective definition and food scanning  
  - [ ] **Task**: Iterate on UI/UX improvements based on test feedback  
  - [ ] **Task**: Finalize and release MVP

