import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "基础知识",
    icon: "/img/computer.svg",
    prefix: "posts/基础知识/",
    children: [
      {
        text: "操作系统",
        icon: "/img/操作系统.svg",
        link: "操作系统/"
      },
      {
        text: "计算机网络",
        icon: "/img/网络计算机.svg",
        link: "计算机网络/"
      },
      {
        text: "数据结构",
        icon: "/img/数据结构.svg",
        link: "数据结构/"
      },
      {
        text: "算法",
        icon: "/img/算法.svg",
        link: "算法/"
      }
    ]
  },
  {
    text: "后端",
    icon: "/img/后端开发.svg",
    prefix: "/posts/后端/",
    children: [
      {
        text: "Java",
        icon: "/img/java.svg",
        link: "Java/"
      },
      {
        text: "SpringBoot",
        icon: "/img/SPRINGBOOT.svg",
        link: "springboot/"
      },
      {
        text: "SpringCloud",
        icon: "/img/SpringCloud.svg",
        link: "springcloud/"
      },
      {
        text: "ElasticSearch",
        icon: "/img/es.svg",
        link: "elasticSearch/"
      }
    ]
  },
  {
    text: "数据库",
    icon: "/img/数据库.svg",
    prefix: "/posts/数据库",
    // children: ["MySQL", "MyBatis", "MyBatisPlus"]
    children: [
      {
        text: "SQL语句",
        icon: "/img/hugeicons--sql.svg",
        link: "SQL"
      },
      {
        text: "MyBatis",
        icon: "/img/mybatis.svg",
        link: "MyBatis"
      },
      {
        text: "MyBatisPlus",
        icon: "/img/mybatisplus.svg",
        link: "MyBatisPlus"
      }, {
        text: "Redis",
        icon: "/img/redis.svg",
        link: "Redis/",
        
      }, {
        text: "MySQL",
        icon: "/img/mysql.svg",
        link: "MySQL/",
        
      }
    ]

  },
  // {
  //   text: "Java",
  //   icon: "/img/java.svg",
  //   prefix: "/posts/Java",
  //   children: [
  //     {
  //       text: "JVM",
  //       icon: "/img/JVM.svg",
  //       link: "jvm"
  //     }
  //   ]},
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
            text: "AliOSS",
            icon: "/img/阿里OSS.svg",
            link: "AliOSS"
          },
          {
            text: "Docker",
            icon: "/img/docker.svg",
            link: "Docker"
          },{
            text: "Kubernetes",
            icon: "/img/k8s.svg",
            link: "k8s"
          }
       
        ]
      },
      {
        text: "项目",
        icon: "/img/项目.svg",
        link: "/posts/项目/"
        
      }


    ]);
