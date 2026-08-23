import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import { usePage, useForm, Head } from "@inertiajs/react";
import { Activity, User, KeyRound, ShieldCheck, Loader2, ArrowRight } from "lucide-react";
function Login({ status, canResetPassword }) {
  const { app_settings } = usePage().props;
  const appName = app_settings?.name || "Sistem Performa";
  const appLogo = app_settings?.logo;
  const loginBg = app_settings?.login_background || "/assets/images/bg-login.jpg";
  const { data, setData, post, processing, errors, reset } = useForm({
    username: "",
    password: "",
    remember: false
  });
  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);
  const submit = (e) => {
    e.preventDefault();
    post(route("login"));
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen w-full flex bg-slate-50 font-sans selection:bg-orange-500 selection:text-white", children: [
    /* @__PURE__ */ jsx(Head, { title: `Masuk - ${appName}` }),
    /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center p-12", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 animate-slow-zoom opacity-40",
          style: {
            backgroundImage: `url('${loginBg}')`
          }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-orange-600/80 via-orange-900/60 to-slate-900/90 mix-blend-multiply" }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-orange-400/30 rounded-full blur-[120px]" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-amber-400/20 rounded-full blur-[100px]" }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 w-full max-w-lg text-white", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 shadow-sm", children: [
          /* @__PURE__ */ jsx(Activity, { size: 16, className: "text-orange-300" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-orange-50", children: "OTS Fitness" })
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "font-extrabold tracking-tight mb-12 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-4xl lg:text-5xl text-white leading-[1.1] tracking-tighter", children: "Smart Fitness," }),
          /* @__PURE__ */ jsx("span", { className: "text-5xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200 leading-[1.1] tracking-tighter drop-shadow-sm pb-1", children: "Better Results" }),
          /* @__PURE__ */ jsx("span", { className: "text-2xl lg:text-2xl text-slate-200 font-bold leading-snug tracking-tight mt-1", children: "Satu Platform, Optimal Tanpa Batas." })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-base lg:text-base text-slate-300/90 font-medium leading-[1.7] max-w-lg mb-12", children: "Platform terpadu untuk internal manajemen gym dan pemantauan latihan client secara real-time. Pantau beban latihan, kelola data progres, dan capai target kebugaran berbasis data melalui kolaborasi optimal antara coach dan member." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 relative bg-white lg:bg-slate-50", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-[80px] lg:hidden -z-10 opacity-50" }),
      /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-8 duration-700", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
          appLogo ? /* @__PURE__ */ jsx(
            "img",
            {
              src: appLogo,
              alt: "Logo Aplikasi",
              className: "w-14 h-14 object-contain drop-shadow-sm"
            }
          ) : /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-orange-500/30", children: appName.charAt(0) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-slate-900 tracking-tight leading-none mb-1", children: "Selamat Datang" }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-slate-500", children: [
              "Silakan masuk ke ",
              appName
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white lg:bg-transparent rounded-3xl lg:rounded-none shadow-xl shadow-slate-200/50 border border-slate-100 lg:shadow-none lg:border-none p-8 lg:p-0", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(
              "label",
              {
                htmlFor: "username",
                className: "text-sm font-bold text-slate-700 ml-1",
                children: "ID Pengguna"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(User, { className: "h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" }) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "username",
                  type: "text",
                  value: data.username,
                  onChange: (e) => setData("username", e.target.value),
                  className: "block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl text-sm focus:bg-white focus:border-orange-500 focus:ring-orange-500/20 focus:ring-4 transition-all duration-200 outline-none font-semibold hover:border-slate-300",
                  placeholder: "Masukkan ID Anda",
                  autoComplete: "username"
                }
              )
            ] }),
            errors.username && /* @__PURE__ */ jsxs("p", { className: "text-rose-500 text-sm mt-1.5 ml-1 font-semibold flex items-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "w-1 h-1 rounded-full bg-rose-500" }),
              errors.username
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between ml-1", children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "password",
                  className: "text-sm font-bold text-slate-700",
                  children: "Kata Sandi"
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#",
                  className: "text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors",
                  children: "Lupa Sandi?"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(KeyRound, { className: "h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" }) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "password",
                  type: "password",
                  value: data.password,
                  onChange: (e) => setData("password", e.target.value),
                  className: "block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl text-sm focus:bg-white focus:border-orange-500 focus:ring-orange-500/20 focus:ring-4 transition-all duration-200 outline-none font-semibold hover:border-slate-300 tracking-wider",
                  placeholder: "••••••••",
                  autoComplete: "current-password"
                }
              )
            ] }),
            errors.password && /* @__PURE__ */ jsxs("p", { className: "text-rose-500 text-sm mt-1.5 ml-1 font-semibold flex items-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "w-1 h-1 rounded-full bg-rose-500" }),
              errors.password
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center pt-2", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center cursor-pointer group", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-center w-5 h-5 mr-3", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  name: "remember",
                  checked: data.remember,
                  onChange: (e) => setData(
                    "remember",
                    e.target.checked
                  ),
                  className: "peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md bg-slate-50 checked:bg-orange-500 checked:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all cursor-pointer"
                }
              ),
              /* @__PURE__ */ jsx(
                ShieldCheck,
                {
                  className: "absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity",
                  strokeWidth: 3
                }
              )
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-slate-500 group-hover:text-slate-700 transition-colors", children: "Tetap masuk di perangkat ini" })
          ] }) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "w-full bg-orange-500 text-white font-bold py-4 mt-4 rounded-xl shadow-[0_8px_20px_rgba(249,115,22,0.25)] hover:shadow-[0_12px_25px_rgba(249,115,22,0.35)] hover:bg-orange-600 hover:-translate-y-1 transform active:scale-[0.98] transition-all duration-300 flex justify-center items-center text-sm disabled:opacity-70 group",
              children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Loader2, { className: "animate-spin h-5 w-5 mr-2" }),
                /* @__PURE__ */ jsx("span", { children: "Otentikasi..." })
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                "Masuk ke Portal",
                /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" })
              ] })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-12 text-center lg:text-left", children: /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold text-slate-400", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " ",
          appName,
          ". All rights reserved.",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Sistem Informasi Manajemen Olahraga" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { jsx: true, children: `
                @keyframes slow-zoom {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
                .animate-slow-zoom {
                    animation: slow-zoom 20s ease-in-out infinite;
                }
            ` })
  ] });
}
export {
  Login as default
};
