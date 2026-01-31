import { createContext, useState } from "react";

 export const Recruiter = createContext();

export const RecruiterProvider = ({children}) =>{
    const [jobsCount , setJobsCount] = useState(0);
    return(
        <Recruiter.Provider value={{jobsCount , setJobsCount}}>
            {children}
        </Recruiter.Provider>
    );
};