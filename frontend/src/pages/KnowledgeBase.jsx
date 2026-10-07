import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function KnowledgeBase() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const loadArticles = async (query = "") => {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get(
        `/knowledge${
          query
            ? `?search=${encodeURIComponent(query)}`
            : ""
        }`
      );

      const data =
        response.data?.articles ||
        response.data?.data ||
        response.data ||
        [];

      setArticles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load knowledge base."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const searchArticles = (e) => {
    e.preventDefault();
    loadArticles(search);
  };

  const markHelpful = async (id) => {
    try {
      await api.patch(`/knowledge/${id}/helpful`);

      setMessage("Thanks! Your feedback was recorded.");

      setArticles((currentArticles) =>
        currentArticles.map((article) =>
          article._id === id
            ? {
                ...article,
                helpfulCount:
                  (article.helpfulCount || 0) + 1,
              }
            : article
        )
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to record feedback."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }

    return "M";
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-[270px] flex-col border-r border-slate-200 bg-white lg:flex">

          <div className="border-b border-slate-200 px-6 py-6">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#182653] to-[#ff5d73] text-lg font-bold text-white shadow-md">
                SD
              </div>

              <div>
                <h1 className="text-lg font-bold text-[#101b3d]">
                  ServiceDesk Pro
                </h1>

                <p className="text-xs text-slate-500">
                  IT Service Management
                </p>
              </div>

            </div>

          </div>

          <div className="flex-1 px-4 py-7">

            <p className="px-3 text-xs font-bold tracking-[0.18em] text-slate-400">
              MANAGEMENT
            </p>

            <nav className="mt-4 space-y-2">

              <SidebarItem
                icon="▣"
                label="Dashboard"
                onClick={() => navigate("/manager")}
              />

              <SidebarItem
                icon="▥"
                label="Ticket Management"
                onClick={() =>
                  navigate("/ticket-management")
                }
              />

              <SidebarItem
                icon="♙"
                label="Technicians"
                onClick={() =>
                  navigate("/technician-management")
                }
              />

              <SidebarItem
                icon="◷"
                label="SLA Monitoring"
                onClick={() =>
                  navigate("/sla-monitor")
                }
              />

              <SidebarItem
                icon="▤"
                label="Reports"
                onClick={() =>
                  navigate("/reports")
                }
              />

              <SidebarItem
                active
                icon="?"
                label="Knowledge Base"
              />

            </nav>

          </div>

          <div className="border-t border-slate-200 p-4">

            <div className="rounded-xl bg-slate-50 p-3">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#182653] to-[#ff5d73] text-sm font-bold text-white">
                  {getInitial()}
                </div>

                <div className="min-w-0">

                  <p className="truncate text-sm font-semibold text-[#101b3d]">
                    {user.name || "IT Manager"}
                  </p>

                  <p className="text-xs text-slate-500">
                    IT Manager
                  </p>

                </div>

              </div>

            </div>

            <button
              onClick={logout}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Logout
            </button>

          </div>

        </aside>

        {/* MAIN */}
        <main className="min-w-0 flex-1">

          {/* HEADER */}
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5 lg:px-10">

            <div>

              <p className="text-xs font-bold tracking-[0.18em] text-[#ff5d73]">
                KNOWLEDGE CENTER
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Find solutions and troubleshooting guides
              </p>

            </div>

            <div className="flex items-center gap-3">

              <div className="hidden text-right sm:block">

                <p className="text-sm font-semibold text-[#101b3d]">
                  {user.name || "IT Manager"}
                </p>

                <p className="text-xs text-slate-500">
                  IT Manager
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#182653] to-[#ff5d73] text-sm font-bold text-white">
                {getInitial()}
              </div>

            </div>

          </header>

          <div className="p-6 lg:p-10">

            <div className="mx-auto max-w-7xl">

              {/* SEARCH HERO */}
              <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#18285d] via-[#31356f] to-[#ef5b73] p-7 shadow-lg">

                <div className="relative z-10 max-w-3xl">

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">
                    FIND THE RIGHT SOLUTION
                  </p>

                  <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                    What can we help you solve?
                  </h1>

                  <p className="mt-2 text-sm text-white/75">
                    Search troubleshooting guides, solutions, and IT support information.
                  </p>

                  <form
                    onSubmit={searchArticles}
                    className="mt-6 flex flex-col gap-3 sm:flex-row"
                  >

                    <div className="flex flex-1 items-center rounded-xl bg-white px-4 shadow-sm">

                      <span className="mr-3 text-lg text-slate-400">
                        ⌕
                      </span>

                      <input
                        value={search}
                        onChange={(e) =>
                          setSearch(e.target.value)
                        }
                        placeholder="Search Wi-Fi, VPN, password, software..."
                        className="w-full bg-transparent py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                      />

                    </div>

                    <button
                      type="submit"
                      className="rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[#18285d] transition hover:bg-slate-100"
                    >
                      Search
                    </button>

                  </form>

                </div>

                <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10" />

                <div className="absolute -bottom-24 right-20 h-56 w-56 rounded-full bg-white/10" />

              </section>

              {/* MESSAGE */}
              {message && (
                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm font-medium text-blue-700">
                  {message}
                </div>
              )}

              {/* SECTION TITLE */}
              <div className="mt-8 flex items-end justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff6172]">
                    SUPPORT RESOURCES
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-[#14234d]">
                    Helpful articles
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Browse solutions for common support requests.
                  </p>

                </div>

                <div className="hidden rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm sm:block">
                  {articles.length}{" "}
                  {articles.length === 1
                    ? "article"
                    : "articles"}
                </div>

              </div>

              {/* LOADING */}
              {loading ? (

                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#ff6172]" />

                  <p className="mt-4 text-sm text-slate-500">
                    Searching knowledge base...
                  </p>

                </div>

              ) : articles.length === 0 ? (

                /* EMPTY STATE */
                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-400">
                    ?
                  </div>

                  <h2 className="mt-5 text-xl font-bold text-[#14234d]">
                    No solutions found
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Try different keywords such as Wi-Fi, VPN, password,
                    software, laptop, or network.
                  </p>

                </div>

              ) : (

                /* ARTICLES */
                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                  {articles.map((article) => (

                    <article
                      key={article._id}
                      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                    >

                      {/* ARTICLE HEADER */}
                      <div className="flex items-start justify-between gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg text-[#3156c9]">
                          ?
                        </div>

                        {article.category && (
                          <span className="rounded-full bg-[#fff0ed] px-3 py-1.5 text-[11px] font-bold text-[#ef5b73]">
                            {article.category}
                          </span>
                        )}

                      </div>

                      <h3 className="mt-5 text-lg font-bold leading-6 text-[#14234d]">
                        {article.title}
                      </h3>

                      <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-500">
                        {article.content}
                      </p>

                      {/* SOLUTION */}
                      {article.solution && (
                        <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">

                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ff6172]">
                            RECOMMENDED SOLUTION
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {article.solution}
                          </p>

                        </div>
                      )}

                      {/* TAGS */}
                      {Array.isArray(article.tags) &&
                        article.tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">

                            {article.tags.map(
                              (tag, index) => (
                                <span
                                  key={`${tag}-${index}`}
                                  className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700"
                                >
                                  #{tag}
                                </span>
                              )
                            )}

                          </div>
                        )}

                      {/* FOOTER */}
                      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">

                        <div>

                          <p className="text-xs text-slate-400">
                            {article.views || 0} views
                          </p>

                          {article.helpfulCount > 0 && (
                            <p className="mt-1 text-[11px] text-slate-400">
                              {article.helpfulCount} found helpful
                            </p>
                          )}

                        </div>

                        <button
                          onClick={() =>
                            markHelpful(article._id)
                          }
                          className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-[#18285d] transition hover:border-[#ff6172] hover:bg-[#fff5f3] hover:text-[#ef5b73]"
                        >
                          👍 Helpful
                        </button>

                      </div>

                    </article>

                  ))}

                </div>

              )}

            </div>

          </div>

        </main>

      </div>
    </div>
  );
}

function SidebarItem({
  label,
  icon,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold ${
        active
          ? "bg-[#243d7d] text-white shadow-md"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
          active ? "bg-white/10" : "bg-slate-100"
        }`}
      >
        {icon}
      </span>

      {label}
    </button>
  );
}