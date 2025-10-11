import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import {resumes} from "~/constants";
import ResumeCard from "~/components/ResumeCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <main className={"bg-[url('/images/bg-main.svg')] bg-cover"}>
      <Navbar/>
      <section className={"main-section"} >
        <div className={"page-heading"}>
            <h1>Track Your Applications & resume Ratings</h1>
            <h2>Review Your submissions and check AI-powered feedback</h2>
        </div>
      {
          resumes?.length && (
              <div className={"resumes-section"}>
                  {resumes.map((resume)=>{
                      return (
                          <ResumeCard key ={resume.id} resume={resume}/>
                      )
                  })}
              </div>
          )
      }
      </section>

  </main>
}
