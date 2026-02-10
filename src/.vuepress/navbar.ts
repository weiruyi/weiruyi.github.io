import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "博客",
    icon: "/img/finder.svg",
    link: "/posts/blog/"
  },
  {
    text: "存档",
    icon: "/img/Archive.svg",
    prefix: "/posts/old存档/",
    children: [
      {
        text: "Java基础",
        icon: "/img/java.svg",
        link: "Java/"
      },
      {
        text: "GoLang基础",
        icon: "/img/golang.svg",
        link: "GoLang/"
      },
      {
        text: "数据库",
        icon: "/img/数据库.svg",
        link: "数据库/"
      },
      {
        text: "后端",
        icon: "/img/SPRINGBOOT.svg",
        link: "springboot/"
      },
      {
        text: "微服务",
        icon: "/img/SpringCloud.svg",
        link: "springcloud/"
      },
      {
        text: "ELK",
        icon: "/img/Elastic.svg",
        link: "elasticSearch/"
      },{
        text: "算法",
        icon: "/img/算法.svg",
        link: "算法/"
      }
    ]
  },
      {
        text: "工具",
        icon: "/img/tool.svg",
        prefix: "/posts/工具",
        children: [
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
          }
       
        ]
      }
    ]);
