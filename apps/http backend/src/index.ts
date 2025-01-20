import express from 'express';
import { Request, Response } from 'express';

const app = express();

app.post('/api/v1/users', (req, res) => {
  res.send('Hello World!');
});

app.post('/signup',(req:Request,res:Response)=>{
    
  
})
app.post('/signin',(req,res)=>{
  res.send('you are signing in');
})


app.listen(3001, () => {
  console.log('listening on port 3001');
});