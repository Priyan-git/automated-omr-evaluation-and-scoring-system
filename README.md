**🧠 OMR-Automate:**


 AI-Powered Optical Mark Recognition and Scoring System
A complete, end-to-end system designed to automate the tedious process of grading OMR sheets. This project transforms a manual, time-consuming task into a fast, accurate, and auditable digital workflow.


**🎯 Project Overview**


OMR-Automate is a sophisticated application engineered to address the challenges of traditional OMR sheet grading. By leveraging a powerful computer vision pipeline, the system intelligently analyzes scanned images, scores them against a provided answer key, and presents the results in a professional web interface. This not only accelerates the evaluation process but also introduces a crucial layer of transparency and accuracy.
Designed from a comprehensive Product Requirements Document (PRD), the architecture prioritizes modularity, precision, and a "human-in-the-loop" review process, targeting an exceptional error tolerance of less than 0.5%.


**✨ Key Features**


📸 Advanced Image Processing:   
A robust OpenCV-powered pipeline automatically corrects for perspective distortion, rotation, and lighting variations, ensuring reliable analysis from any image source.

🤖 Intelligent Bubble Analysis:
 The system employs advanced contour detection and a bespoke sorting algorithm to precisely locate every bubble in the correct reading order, adeptly handling complex, multi-column layouts.

✅ High-Accuracy Scoring:
 Rather than relying on a single global threshold, the application uses localized Otsu's binarization on each bubble individually, allowing it to accurately interpret faint or partially erased marks.

💻 Professional Review UI:
 A modern, decoupled frontend built with Next.js and React provides a sophisticated and intuitive dashboard for evaluators to review, filter, and manually correct results.

🔗 Decoupled Architecture:
 A high-performance FastAPI backend serves the core computer vision logic as a web service, allowing any modern frontend to connect and interact with the system seamlessly.

🔑 Flexible Answer Key Management:
 The system dynamically loads answer keys from complex, multi-column .xlsx files, making it highly adaptable to various exam formats without code changes.

🔬 Ready for Machine Learning:
 The integrated review UI is designed for "human-in-the-loop" feedback, enabling the effortless collection and labeling of bubble images to train a future ML classifier for even greater accuracy.

🛠️ Technology Stack
The application is built with a modern, decoupled architecture, leveraging best-in-class tools for both the backend processing and the frontend user experience.
| Category      | Technology   | Purpose                                               |
| :------------ | :----------- | :---------------------------------------------------- |
| **Backend** | **Python** | Core programming language                             |
|               | **FastAPI** | High-performance API framework                        |
|               | **OpenCV** | Computer vision and image processing                  |
|               | **Pandas** | Reading and parsing Excel files                       |
|               | **Uvicorn** | ASGI server for running the FastAPI application       |
| **Frontend** | **Next.js** | React framework for the UI                            |
|               | **React** | The core UI library                                   |
|               | **TypeScript** | For type safety and robust frontend code              |
|               | **Tailwind CSS** | For styling the modern user interface                 |
|               | **shadcn/ui**| For professional, accessible, and themeable UI components |


**Process pipline:**
The Processing Pipeline
The system follows a modular, multi-step pipeline to ensure accuracy and auditability at every stage:
Upload: An evaluator uploads the OMR sheet image and an Excel answer key via the React frontend.
API Request: The frontend securely transmits the files to the FastAPI backend.

Image Rectification:
 The backend prepares the image for analysis, correcting for any skew or distortion.
Bubble Detection:
 The system uses cv2.findContours to identify all potential bubbles on the sheet.
Intelligent Sorting:
 The detected bubbles are algorithmically sorted into the correct reading order.
Answer Analysis:
 Each bubble is individually analyzed to determine if it has been marked by the student.
Scoring:
 The system cross-references the student's answers with the parsed answer key.
JSON Response:
 The backend returns a detailed JSON object containing the final score and a full answer breakdown.
UI Rendering:
 The React frontend receives the JSON and dynamically displays the results in the dashboard for review.

**🚀 Getting Started**

To run this project locally, you will need two separate terminals: one for the backend and one for the frontend.


```
python Prerequisites
python
Python 3.9+
Node.js and npm
```
```
1. Backend Setup
# Clone the repository
git clone [your-repo-url]
cd [your-repo-name]

# Install Python dependencies
pip install -r requirements.txt

# Run the backend server
python -m uvicorn backend:app --reload


The backend API will now be running at http://127.0.0.1:8000.
2. Frontend Setup
# In a new terminal, navigate to the frontend directory
cd frontend

# Install npm packages
npm install
```

```python
# Run the frontend development server
npm run dev

```

