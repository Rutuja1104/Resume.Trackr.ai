import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
// import { resumes } from "~/constants";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingRresumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadingRresumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list('resume:*', true)) as KVItem[];
      const parsedResumes = resumes?.map((resume) => (JSON.parse(resume.value) as Resume));
      console.log("parsedResumes", parsedResumes)
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }
    loadingRresumes()
  }, [auth.isAuthenticated])

  return <main className={"bg-[url('/images/bg-main.svg')] bg-cover"}>
    <Navbar />
    <section className={"main-section"} >
      <div className={"page-heading py-16"}>
        <h1>Track Your Applications & resume Ratings</h1>
        {!loadingRresumes && resumes?.length === 0 ? (
          <h2>No resumes found. Upload Your first resume get feedback</h2>
        ) : (
          <h2>Review Your submissions and check AI-powered feedback</h2>
        )}
      </div>
      {
        loadingRresumes ? (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]"/>
          </div>
        ) : <></>
      }
      {
        !loadingRresumes && resumes?.length ? (
          <div className={"resumes-section"}>
            {resumes.map((resume) => {
              return (
                <ResumeCard key={resume.id} resume={resume} />
              )
            })}
          </div>
        ) : <></>
      }
      {!loadingRresumes && resumes?.length ===0 && (
        <div className="flex flex-col items-center justify-center mt-10 gap-4">
          <Link to={'/upload'} className="primary-button w-fit text-xl font-semibold ">
            Upload resume
          </Link>
        </div>
      )}
    </section>
  </main>
}
