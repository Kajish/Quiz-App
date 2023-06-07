Begining from server.js in src folder 
    conncection to mongo db with the mongoose.connect command 
    has endpoints 



endpoints 
1. /api/auth/login  -post method
2. /api/auth/signup -post method
3. /api/auth/signout - use /post method
4. /api/auth/delete-account - delete method
5. /api/quiz/new -post method
6. /api/quiz/delete-quiz/:quizd - delete method
7. /api/quiz/:quizid/qustion/:questionId - put method
8. /user/quiz/:link -get method // need to work on this 


Example requestt bodies


 signup    
{
    "username": "vijay",
    "email": "vijay@gmail.com",
    "password": "Vijayp@1"
 
}




login 
{
    "email": "ajish@gmail.com",
    "password": "ajish123"
}





signout 
 needs only the header 
    Authorization  : token







create new quizz 
 {
  "title": "Math Quiz",
  "questions": [
    {
      "question": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"],
      "correctOption": 1
    },
    {
      "question": "What is the square root of 16?",
      "options": ["2", "4", "6", "8"],
      "correctOption": 1
    },
    {
      "question": "What is 10 multiplied by 5?",
      "options": ["25", "35", "45", "50"],
      "correctOption": 3
    }
  ]
}

and  Header 
Authorization : token


