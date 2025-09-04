import authRoutes from './authRoute.js';

const mountRouter=(app)=>{
   
    
    app.use('/api/v1',authRoutes);
  


}


export default mountRouter;