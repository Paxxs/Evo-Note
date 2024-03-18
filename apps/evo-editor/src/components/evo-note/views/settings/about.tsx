export default function About() {
  return (
    <>
      <div className="py-8 px-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          📓 v2Note
        </h1>
        <h2 className="scroll-m-20 border-b text-lg font-semibold tracking-tight text-left pt-5">
          A Cutting-Edge, Privacy-Centric Note-taking Experience
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Unleash your productivity with v2Note, where elegance meets
          innovation. Dive into a dual editing paradigm, blending Notion-like
          block organization with a boundless whiteboard canvas 🎨. Transition
          effortlessly, crafting your narrative within a unified ecosystem.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Championing a local-first ethos, v2Note prioritizes your privacy 🔐.
          Experience sovereign data control, free from cloud dependency,
          ensuring a sanctuary for your thoughts.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          With its cross-platform prowess, v2Note transcends boundaries on
          Windows, macOS, and Linux 💻. Anticipate the advent of self-hosted
          cloud synchronization, merging accessibility with autonomy.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Opt for server mode to globalize your workspace, enabling ubiquitous
          access through any web portal 🌍. Tailor your digital domain, where
          convenience coalesces with customization.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Harnessing the power of a CRDT-powered editor and Yjs&apos;s real-time
          collaborative framework, v2Note is poised to revolutionize teamwork by
          ensuring seamless and synchronous content creation 🚀.
        </p>
      </div>
    </>
  );
}
