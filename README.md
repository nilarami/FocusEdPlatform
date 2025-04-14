
# 🎯 FocusEd Platform 

> **An intelligent eye-tracking tool to boost student engagement and retention during lectures or reading activities.**
>
> ### Created by:
- **Nila Sadeeshkumar**
- **Alicia Bochnak**

---

## 🧠 Overview

**FocusEd Platform** is an automated tool designed to **enhance student motivation and memory retention** by monitoring attention levels through real-time **eye-tracking**. When inattentiveness is detected, the system actively intervenes by prompting the student with **contextual questions** based on recent content — turning passive learning into an interactive, memory-boosting experience.

---

## 🚀 Key Features

- 👁️ **Eye-Tracking Monitoring**  
  Continuously monitors student focus during lectures or reading tasks.

- 🛎️ **Real-Time Interventions**  
  Detects loss of attention and prompts students with questions to re-engage.

- 🧩 **Dynamic Content Recall**  
  Automatically generates questions from previously viewed content to reinforce learning.

- 📈 **Engagement Analytics**  
  Tracks student attentiveness patterns and learning habits.

---

## 🧰 Tech Stack

| Layer        | Technologies                                                                 |
|--------------|------------------------------------------------------------------------------|
| **Frontend** | [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/)     |
| **Backend**  | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)         |
| **AI & ML**  | [OpenAI GPT API](https://platform.openai.com/), CNN-based Eye Gaze Detection |
| **Cloud**    | [Amazon Web Services (AWS)](https://aws.amazon.com/)                         |

---

## 📸 Demo

Watch Here: 

https://www.youtube.com/watch?v=Ot8WfDF6DxQ 

---

## 🧪 How It Works

1. **Real-time eye-tracking** captures the student’s gaze through the webcam.
2. The model analyzes gaze patterns to detect signs of inattentiveness.
3. When attention drops, a **ChatGPT-powered question** is generated from previous content.
4. The student answers, reinforcing key points and regaining focus.

---

## ⚙️ Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/nilarami/FocusEdPlatform.git
cd FocusEdPlatform

# 2. Install dependencies
npm install

# 3. Add your environment variables
touch .env
# (Add your OpenAI key, AWS credentials, etc.)

# 4. Run the development server
npm run dev


Open [http://127.0.0.1:3000](http://127.0.0.1:3000)
