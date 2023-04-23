import { type NextPage } from "next";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { Language } from "~/types/code";
import { healthCheckApi, sendDataToApi, useDebounce } from "~/utils/clients";

const Home: NextPage = () => {
  const [code, setCode] = useState<string>("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [codeGenerated, setCodeGenerated] = useState<string>("");
  const [checkServer, setCheckServer] = useState<boolean>(true);
  const debouncedCode = useDebounce(code, 1000);
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
        const response = await sendDataToApi({ data: debouncedCode, language });

        if (response) {
          const firstLine = response.split("\n")?.[0] || "Nothing";
          setCodeGenerated(firstLine);
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
  }, [debouncedCode, language, setCodeGenerated, setGenerating]);

  useEffect(() => {
    if (!!debouncedCode) {
      generate();
    }
  }, [generate, debouncedCode]);

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
              <div className="mb-4 flex max-h-60 max-w-lg flex-col gap-4 rounded-xl bg-white/10 p-4 text-white ">
                <h3 className="sticky top-0 text-2xl font-bold">Problem</h3>
                <div className="overflow-y-auto">
                  <div className="rounded-md bg-gray-800 p-4">
                    <code className="font-mono text-sm">
                      Input: nums = [2,7,11,15], target = 9<br></br>
                      Output: [0,1]
                      <br></br>
                      <br></br>
                      Explanation:
                      <br></br>
                      Because nums[0] + nums[1] == 9, we return [0, 1].
                    </code>
                  </div>
                </div>
              </div>
              <div className="flex max-w-lg flex-col gap-4 rounded-xl bg-white/10 p-4 text-white ">
                <h3 className="text-2xl font-bold">Code generation</h3>
                <div className="overflow-y-auto">
                  <div className="rounded-md bg-gray-800 p-4">
                    {generating ? (
                      <div className="flex items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
                      </div>
                    ) : (
                      <code className="whitespace-pre-wrap font-mono text-sm">
                        {codeGenerated}
                      </code>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="flex h-full max-w-lg flex-col gap-4 rounded-xl bg-white/10 p-4 text-white ">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Input →</h3>

                  <button
                    onClick={generate}
                    className="text-gray-500 hover:text-gray-100 focus:outline-none"
                  >
                    regen
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
