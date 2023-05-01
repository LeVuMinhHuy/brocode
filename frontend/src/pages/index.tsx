import { type NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { remark } from "remark";
import html from "remark-html";
import { Language, type ResponseData } from "~/types/code";
import { healthCheckApi, sendDataToApi } from "~/utils/clients";

const INIT_DATA = {
  codeGenerated: "# Solution",
  summaryGenerated: "# Summary",
  generateInfoPrompt: "Generate Solution only",
  generateCodePrompt: "class Solution: \n\tdef",
  problem: "# Generate two sum solution",
  serverInfo: "Only open from 1pm to 5pm (UTC +7)",
};

const Home: NextPage = () => {
  //const [code, setCode] = useState<string>("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [codeGenerated, setCodeGenerated] = useState<string>(
    INIT_DATA.codeGenerated
  );
  const [summaryGenerated, setSummaryGenerated] = useState<string>(
    INIT_DATA.summaryGenerated
  );
  const [checkServer, setCheckServer] = useState<boolean>(false);
  const [problem, setProblem] = useState<string>(INIT_DATA.problem);
  const [htmlProblem, setHtmlProblem] = useState<string>("");
  const [isUserQuestion, setIsUserQuestion] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [continueCount, setContinueCount] = useState<number>(1);
  const [codePrompt, setCodePrompt] = useState<string>(
    INIT_DATA.generateCodePrompt
  );

  //const debouncedQuestion = useDebounce(question, 2000);
  const language = Language.Python; // just for now

  useEffect(() => {
    const check = async () => {
      const result = await healthCheckApi();
      console.log({ result });
      if (result) {
        setCheckServer(!!result);
      }
    };

    void check();
  }, []);

  const generate = useCallback(
    (prefix = "") => {
      const send = async (): Promise<void> => {
        try {
          setGenerating(true);

          const commentProblem = `# ${problem.replace(/\n/g, "\n#")}`;
          const commentQuestion = `# ${question.replace(/\n/g, "\n#")}`;

          const convertCodePrompt = codePrompt
            .replace(/<br>/g, "\n")
            .replace(/    /g, "\t");

          const response: ResponseData | undefined = await sendDataToApi({
            data: `${isUserQuestion ? commentQuestion : commentProblem} \n ${
              INIT_DATA.generateInfoPrompt
            } \n ${prefix || convertCodePrompt}`,
            language,
            continue_count: continueCount,
          });

          if (response) {
            const codeResponse = response.code;
            const summaryResponse = response.summary;

            if (summaryResponse) {
              setSummaryGenerated(
                summaryResponse.split(".")?.[0] || summaryResponse
              );
            }

            const filteredResponse = codeResponse.split(
              prefix || convertCodePrompt
            )[1];

            const prefixFilterResponse = filteredResponse
              ? `${prefix || convertCodePrompt} ${filteredResponse}`
              : null;

            const htmlCodeGenerated = prefixFilterResponse
              ? prefixFilterResponse
                  .replace(/\n/g, "<br>")
                  .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
              : "Nothing";
            const code = htmlCodeGenerated;
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      language,
      setCodeGenerated,
      setGenerating,
      problem,
      codePrompt,
      continueCount,
    ]
  );

  const newProblem = useCallback(async () => {
    const response = await fetch("/leetcode-solutions.json");
    const problems = (await response.json()) as Record<string, string>[];

    if (problems && !!problems.length) {
      const random_id = Math.floor(Math.random() * problems.length);
      const randomProblem: string | undefined = problems.find(
        (item) => item.id === String(random_id)
      )?.problem_only;

      if (randomProblem) {
        setProblem(randomProblem);
        const htmlProblem = remark().use(html).processSync(randomProblem);

        setHtmlProblem(htmlProblem.toString().replace(/\n/g, "<br>"));
      }
    }
  }, [setHtmlProblem]);

  useEffect(() => {
    void newProblem();
  }, [newProblem]);

  const handleInputQuestion = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
    setContinueCount(1);
  };

  const handleInputPrompt = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCodePrompt(e.target.value);
    setContinueCount(1);
  };

  //const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //  setCode(e.target.value);
  //};

  return (
    <>
      <Head>
        <title>Brocode</title>
        <meta
          name="description"
          content="An AI bro, coding algorithm with you "
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome-animation/0.2.1/font-awesome-animation.min.css"
        />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Bro</span>code
          </h1>

          <div>
            <div className="mb-2 flex items-center justify-center">
              <a
                href="https://github.com/LeVuMinhHuy/brocode"
                rel="noopener nofollow noreferrer"
                className="mr-3 inline-flex items-center rounded-full border border-gray-200 bg-white px-2 py-2 hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-purple-800 dark:bg-purple-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-500"
              >
                <Image src="/github.svg" alt="Github" width={18} height={18} />
              </a>
              <a
                href="https://huggingface.co/mhhmm/codegen-6B-lora"
                rel="noopener nofollow noreferrer"
                className="mr-3 inline-flex items-center rounded-full border border-gray-200 bg-white px-2 py-2 hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-purple-800 dark:bg-purple-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-500"
              >
                <Image
                  src="/hf-logo.svg"
                  alt="HuggingFace"
                  width={18}
                  height={18}
                />
              </a>
              <a
                href="https://colab.research.google.com/drive/1dBI4t4Fgn150lAzM_EV6TP0f1_1SYAN-?usp=sharing"
                rel="noopener nofollow noreferrer"
                className="mr-3 inline-flex items-center rounded-full border border-gray-200 bg-white px-2 py-2 hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-purple-800 dark:bg-purple-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-500"
              >
                <Image
                  src="/colab.svg"
                  alt="Google Colab"
                  width={18}
                  height={18}
                />
              </a>
            </div>
            {checkServer ? (
              <p className="text-center text-green-400">
                {"Server status: Online"}
              </p>
            ) : (
              <p className="text-center text-red-400">
                {"Server status: Offline"}
              </p>
            )}
            <p className="text-center text-gray-500 dark:text-gray-400">
              {INIT_DATA.serverInfo}
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-11 md:gap-8">
            <div className="col-span-5">
              <div className="mb-4 flex h-full flex-col gap-4 rounded-xl bg-white/10 p-4 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Problem</h3>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        void newProblem();
                        setContinueCount(1);
                        setIsUserQuestion(false);
                      }}
                      className="mb-2 mr-2 rounded-lg bg-purple-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                    >
                      New
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!isUserQuestion) {
                          setContinueCount(1);
                        }
                        setIsUserQuestion(true);
                      }}
                      className="mb-2 mr-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                    >
                      Input
                    </button>
                  </div>
                </div>
                <div className="h-full overflow-y-auto">
                  {isUserQuestion ? (
                    <>
                      <textarea
                        id="question"
                        className="h-full w-full rounded-md bg-gray-800 px-3 py-2 font-mono text-sm focus:outline-none"
                        rows={10}
                        placeholder="Enter your own challenge here"
                        value={question}
                        onChange={handleInputQuestion}
                      ></textarea>
                    </>
                  ) : (
                    <>
                      <div className="rounded-md bg-gray-800 p-4">
                        <code className="font-mono text-sm">
                          <div
                            dangerouslySetInnerHTML={{ __html: htmlProblem }}
                          />
                        </code>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-1 flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  setCodeGenerated(INIT_DATA.codeGenerated);
                  setSummaryGenerated(INIT_DATA.summaryGenerated);
                  generate();
                }}
                className="mb-2 mr-2 w-full rounded-lg border border-purple-700 px-5 py-2.5 text-center text-sm font-medium text-purple-700 hover:bg-purple-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-purple-300 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-500 dark:hover:text-white dark:focus:ring-purple-900"
              >
                <i className="fas fa-code fa-shake text-white"></i>
              </button>
            </div>

            <div className="col-span-5">
              <div className="flex h-full flex-col gap-4 rounded-xl bg-white/10 p-4 text-white ">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Brocode →</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setContinueCount((prev: number) => prev + 1);
                      generate(codeGenerated);
                    }}
                    className="mb-2 rounded-lg bg-purple-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                  >
                    Continue
                  </button>
                </div>

                <textarea
                  id="question"
                  className="h-24 w-full rounded-md bg-gray-800 px-3 py-2 font-mono text-sm focus:outline-none"
                  rows={10}
                  placeholder="# Prompt"
                  value={codePrompt}
                  onChange={handleInputPrompt}
                ></textarea>

                <div className="h-full rounded-md bg-gray-800 p-4">
                  <code className="font-mono text-sm">
                    <div dangerouslySetInnerHTML={{ __html: codeGenerated }} />

                    {generating && (
                      <div className="text-white-800 dark:text-white-200 mt-4 animate-pulse rounded-full bg-gray-800 px-3 py-1 text-center text-xs font-medium leading-none dark:bg-gray-800">
                        generating...
                      </div>
                    )}
                  </code>
                </div>
                <div className="rounded-md bg-gray-800 p-4">
                  <code className="font-mono text-sm">{summaryGenerated}</code>

                  {generating && (
                    <div className="text-white-800 dark:text-white-200 mt-4 animate-pulse rounded-full bg-gray-800 px-3 py-1 text-center text-xs font-medium leading-none dark:bg-gray-800">
                      summarizing...
                    </div>
                  )}
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
