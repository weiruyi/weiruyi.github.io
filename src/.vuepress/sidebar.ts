import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/posts/工具/": [
    {
      text: "Markdown",
      icon: "/img/markdown.svg",
      link: "Markdown"
    },
    {
      text: "Latex公式",
      icon: "/img/latex.svg",
      link: "latexMath"
    },
    {
      text: "Git",
      icon: "/img/git.svg",
      link: "Git"
    },
    {
      text: "Docker",
      icon: "/img/docker.svg",
      link: "Docker"
    },
    {
      text: "Tmux",
      icon: "/img/tmux.svg",
      link: "Tmux"
    }
  ],
  "/posts/old存档/": [
    {
      text: "Java基础",
      icon: "/img/java.svg",
      prefix: "Java",
      children: "structure"
    },
    {
      text: "GoLang基础",
      icon: "/img/golang.svg",
      prefix: "GoLang",
      children: "structure"
    },
    {
      text: "数据库",
      icon: "/img/数据库.svg",
      prefix: "数据库",
      children: "structure"
    },
     {
      text: "后端",
      icon: "/img/SPRINGBOOT.svg",
      prefix: "springboot",
      children: "structure"
    }, {
      text: "微服务",
      icon: "/img/SpringCloud.svg",
      prefix: "springcloud",
      children: "structure"
    },
    {
      text: "ELK",
      icon: "/img/Elastic.svg",
      prefix: "elasticSearch",
      children: "structure"
    },{
        text: "算法",
        icon: "/img/算法.svg",
        prefix: "算法",
        children: "structure"
      }
  ],
  "/posts/blog/": [
    {
      text: "博客",
      icon: "/img/finder.svg",
      prefix: "",
      children: "structure"
    }
  ],
  

});
