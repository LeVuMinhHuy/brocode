import { type NextPage } from "next";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { remark } from "remark";
import html from "remark-html";
import { Language } from "~/types/code";
import { healthCheckApi, sendDataToApi, useDebounce } from "~/utils/clients";

const Home: NextPage = () => {
  const [code, setCode] = useState<string>("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [codeGenerated, setCodeGenerated] = useState<string>("");
  const [checkServer, setCheckServer] = useState<boolean>(true);
  const [problem, setProblem] = useState<string>("# Generate two sum solution");
  const [htmlProblem, setHtmlProblem] = useState<string>("");
  const [isUserQuestion, setIsUserQuestion] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");

  const debouncedQuestion = useDebounce(question, 2000);
  const language = Language.Python; // just for now

  useEffect(() => {
    const check = async () => {
      const result = await healthCheckApi();
      setCheckServer(!!result);
    };

    void check();
  }, []);

  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const textarea = e.target as HTMLTextAreaElement;
        const start = textarea.selectionStart || 0;
        const end = textarea.selectionEnd || 0;
        setCode(
          textarea.value.substring(0, start) +
            "\t" +
            textarea.value.substring(end)
        );
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }
    };

    document.addEventListener("keydown", handleTabKey);

    return () => {
      document.removeEventListener("keydown", handleTabKey);
    };
  }, []);

  const generate = useCallback(() => {
    const send = async (): Promise<void> => {
      try {
        setGenerating(true);
        const response = await sendDataToApi({
          data: debouncedQuestion,
          language,
        });

        if (response) {
          const code = response || "Nothing";
          setCodeGenerated(code);
          setGenerating(false);
        } else {
          setCodeGenerated("Nothing more");
          setGenerating(false);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    void send();
  }, [debouncedQuestion, language, setCodeGenerated, setGenerating]);

  useEffect(() => {
    if (!!debouncedQuestion) {
      generate();
    }
  }, [generate, debouncedQuestion]);

  useEffect(() => {
    const getProblem = async () => {
      const response = await fetch("/leetcode-solutions.json");
      const problems = (await response.json()) as Record<string, string>[];

      if (problems && !!problems.length) {
        const random_id = Math.floor(Math.random() * problems.length);
        const randomProblem: string | undefined = problems.find(
          (item) => item.id === String(random_id)
        )?.problem_only;

        if (randomProblem) {
          const htmlProblem = remark().use(html).processSync(randomProblem);

          setHtmlProblem(htmlProblem.toString().replace(/\n/g, "<br>"));
        }
      }
    };

    void getProblem();
  }, [setProblem]);

  const handleInputQuestion = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  return (
    <>
      <Head>
        <title>Brocode</title>
        <meta
          name="description"
          content="An AI bro, coding algorithm with you "
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Bro</span>code
          </h1>

          {checkServer ? (
            <p className={"text-green-400"}>{"Server status: Online"}</p>
          ) : (
            <p className={"text-red-400"}>{"Server status: Offline"}</p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <div className="col-span-1">
              <div className="mb-4 flex h-full max-w-lg flex-col gap-4 rounded-xl bg-white/10 p-4 text-white ">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Problem</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserQuestion((prev: boolean) => !prev);
                    }}
                    className="mb-2 rounded-lg bg-purple-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                  >
                    {isUserQuestion ? "Database" : "New"}
                  </button>
                </div>
                <div className="overflow-y-auto	">
                  {isUserQuestion ? (
                    <>
                      <textarea
                        id="question"
                        className="w-128  bg-gray-800 px-3 py-2 font-mono text-sm focus:outline-none"
                        rows={10}
                        placeholder="Enter your own challenge here"
                        value={question}
                        onChange={handleInputQuestion}
                      ></textarea>
                    </>
                  ) : (
                    <>
                      <div className="rounded-md bg-gray-800 p-4">
                        <code className="font-mono text-sm"></code>
                        <div
                          dangerouslySetInnerHTML={{ __html: htmlProblem }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="flex h-full max-w-lg flex-col gap-4 rounded-xl bg-white/10 p-4 text-white ">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Input →</h3>
                  <button
                    type="button"
                    className="mb-2 rounded-lg bg-purple-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                  >
                    Re-generate
                  </button>
                </div>
                <textarea
                  id="code"
                  className="block h-full w-full rounded bg-gray-800 px-3 py-2 focus:outline-none"
                  rows={10}
                  placeholder="Enter your Python code here"
                  value={code}
                  onChange={handleCodeChange}
                ></textarea>
                <div className="rounded-md bg-gray-800 p-4">
                  <code className="font-mono text-sm">{"hehe"}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
