import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,b as n,o as s}from"./app-ocJP0-_o.js";const l="/image/jvm/jvm31.png",t="/image/jvm/jvm32.png",d="/image/jvm/jvm33.png",r="/image/jvm/jvm34.png",v="/image/jvm/jvm35.png",c="/image/jvm/jvm36.png",o="/image/jvm/jvm37.png",m="/image/jvm/jvm38.png",p="/image/jvm/jvm39.png",u="/image/jvm/jvm40.png",g="/image/jvm/jvm41.png",b="/image/jvm/jvm42.png",h="/image/jvm/jvm43.png",f="/image/jvm/jvm44.png",j="/image/jvm/jvm45.png",_="/image/jvm/jvm46.png",x="/image/jvm/jvm47.png",J="/image/jvm/jvm48.png",y="/image/jvm/jvm49.png",C="/image/jvm/jvm50.png",S="/image/jvm/jvm51.png",L="/image/jvm/jvm52.png",D="/image/jvm/jvm53.png",q="/image/jvm/jvm54.png",B="/image/jvm/jvm55.png",E="/image/jvm/jvm56.png",z="/image/jvm/jvm57.png",k="/image/jvm/jvm58.png",A="/image/jvm/jvm59.png",T="/image/jvm/jvm60.png",I="/image/jvm/jvm61.png",w="/image/jvm/jvm62.png",O="/image/jvm/jvm63.png",P="/image/jvm/jvm64.png",R="/image/jvm/jvm65.png",N="/image/jvm/jvm66.png",F="/image/jvm/jvm67.png",K="/image/jvm/jvm68.png",M={},U=n('<h1 id="类加载器" tabindex="-1"><a class="header-anchor" href="#类加载器"><span>类加载器</span></a></h1><h2 id="一、类的生命周期" tabindex="-1"><a class="header-anchor" href="#一、类的生命周期"><span>一、类的生命周期</span></a></h2><p>类的生命周期描述了一个类加载、使用、卸载的整个过程。整体可以分为：</p><ul><li>加载</li><li>连接，其中又分为验证、准备、解析三个子阶段</li><li>初始化</li><li>使用</li><li>卸载</li></ul><figure><img src="'+l+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_1、-加载阶段" tabindex="-1"><a class="header-anchor" href="#_1、-加载阶段"><span>1、 加载阶段</span></a></h3><p>1、加载(Loading)阶段第一步是类加载器根据类的全限定名通过不同的渠道以二进制流的方式获取字节码信息，程序员可以使用Java代码拓展的不同的渠道。</p><ul><li>从本地磁盘上获取文件</li><li>运行时通过动态代理生成，比如Spring框架</li><li>Applet技术通过网络获取字节码文件</li></ul><p>2、类加载器在加载完类之后，Java虚拟机会将字节码中的信息保存到方法区中，方法区中生成一个<code>instanceKlass</code>对象，保存类的所有信息，里边还包含实现特定功能比如多态的信息。</p><figure><img src="'+t+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>3、Java虚拟机同时会在堆上生成与方法区中数据类似的java.lang.Class对象，作用是在Java代码中去获取类的信息以及存储静态字段的数据（JDK8及之后）。</p><figure><img src="'+d+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_2、-连接阶段" tabindex="-1"><a class="header-anchor" href="#_2、-连接阶段"><span>2、 连接阶段</span></a></h3><p>连接阶段分为三个子阶段:</p><ul><li>验证，验证内容是否满足《Java虚拟机规范》。</li><li>准备，给静态变量赋初值。</li><li>解析，将常量池中的符号引用替换成指向内存的直接引用。</li></ul><figure><img src="'+r+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h4 id="验证" tabindex="-1"><a class="header-anchor" href="#验证"><span>验证</span></a></h4><p>验证的主要目的是检测Java字节码文件是否遵守了《Java虚拟机规范》中的约束。这个阶段一般不需要程序员参与。主要包含如下四部分，具体详见《Java虚拟机规范》：</p><p>1、文件格式验证，比如文件是否以0xCAFEBABE开头，主次版本号是否满足当前Java虚拟机版本要求。</p><p>2、元信息验证，例如类必须有父类（super不能为空）。</p><p>3、验证程序执行指令的语义，比如方法内的指令执行中跳转到不正确的位置。</p><p>4、符号引用验证，例如是否访问了其他类中private的方法等。</p><p>对版本号的验证:编译文件的主版本号不能高于运行环境主版本号，如果主版本号相等，副版本号也不能超过。</p><h4 id="准备" tabindex="-1"><a class="header-anchor" href="#准备"><span>准备</span></a></h4><p>准备阶段为静态变量（static）分配内存并设置初值，每一种基本数据类型和引用数据类型都有其初值。</p><table><thead><tr><th><strong>数据类型</strong></th><th><strong>初始值</strong></th></tr></thead><tbody><tr><td><strong>int</strong></td><td><strong>0</strong></td></tr><tr><td><strong>long</strong></td><td><strong>0L</strong></td></tr><tr><td><strong>short</strong></td><td><strong>0</strong></td></tr><tr><td><strong>char</strong></td><td><strong>‘\\u0000’</strong></td></tr><tr><td><strong>byte</strong></td><td><strong>0</strong></td></tr><tr><td><strong>boolean</strong></td><td><strong>false</strong></td></tr><tr><td><strong>double</strong></td><td><strong>0.0</strong></td></tr><tr><td><strong>引用数据类型</strong></td><td><strong>null</strong></td></tr></tbody></table><p>如下代码：</p><div class="language-Java line-numbers-mode" data-ext="Java" data-title="Java"><pre class="language-Java"><code>public class Student{

public static int value = 1;

}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在准备阶段会为value分配内存并赋初值为0，在初始化阶段才会将值修改为1。</p><div class="hint-container tip"><p class="hint-container-title">提示</p><p>final修饰的基本数据类型的静态变量，准备阶段直接会将代码中的值进行赋值。</p></div><p>如下例子中，变量加上final进行修饰，在准备阶段value值就直接变成1了，因为final修饰的变量后续不会发生值的变更。</p><figure><img src="`+v+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>来看这个案例：</p><div class="language-Java line-numbers-mode" data-ext="Java" data-title="Java"><pre class="language-Java"><code>public class HsdbDemo {
    public static final int i = 2;
    public static void main(String[] args) throws IOException, InstantiationException, IllegalAccessException {
        HsdbDemo hsdbDemo = new HsdbDemo();
        System.out.println(i);
        System.in.read();
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从字节码文件也可以看到，编译器已经确定了该字段指向了常量池中的常量2：</p><figure><img src="`+c+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h4 id="解析" tabindex="-1"><a class="header-anchor" href="#解析"><span>解析</span></a></h4><p>解析阶段主要是将常量池中的符号引用替换为直接引用，符号引用就是在字节码文件中使用编号来访问常量池中的内容。</p><figure><img src="'+o+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>直接引用不在使用编号，而是使用内存中地址进行访问具体的数据。</p><figure><img src="'+m+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_3、-初始化阶段" tabindex="-1"><a class="header-anchor" href="#_3、-初始化阶段"><span>3、 初始化阶段</span></a></h3><p>初始化阶段会执行字节码文件中clinit（class init 类的初始化）方法的字节码指令，包含了静态代码块中的代码，并为静态变量赋值。</p><p>如下代码编译成字节码文件之后，会生成三个方法：</p><div class="language-Java line-numbers-mode" data-ext="Java" data-title="Java"><pre class="language-Java"><code>public class Demo1 {

    public static int value = 1;
    static {
        value = 2;
    }
   
    public static void main(String[] args) {

    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="`+p+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><ul><li>init方法，会在对象初始化时执行</li><li>main方法，主方法</li><li>clinit方法，类的初始化阶段执行</li></ul><p>继续来看clinit方法中的字节码指令：</p><p>1、iconst_1，将常量1放入操作数栈。此时栈中只有1这个数。</p><figure><img src="'+u+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>2、putstatic指令会将操作数栈上的数弹出来，并放入堆中静态变量的位置，字节码指令中#2指向了常量池中的静态变量value，在解析阶段会被替换成变量的地址。</p><p>3、后两步操作类似，执行value=2，将堆上的value赋值为2。</p><p>如果将代码的位置互换：</p><div class="language-Java line-numbers-mode" data-ext="Java" data-title="Java"><pre class="language-Java"><code>public class Demo1 {
    static {
        value = 2;
    }
   
    public static int value = 1;
   
    public static void main(String[] args) {

    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>字节码指令的位置也会发生变化：</p><figure><img src="`+g+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><div class="hint-container tip"><p class="hint-container-title">以下几种方式会导致类的初始化：</p><p>1.访问一个类的静态变量或者静态方法，注意变量是final修饰的并且等号右边是常量不会触发初始化。</p><p>2.调用Class.forName(String className)。</p><p>3.new一个该类的对象时。</p><p>4.执行Main方法的当前类。</p><p><strong>添加-XX:+TraceClassLoading 参数可以打印出加载并初始化的类</strong></p></div><h3 id="面试题1" tabindex="-1"><a class="header-anchor" href="#面试题1"><span>面试题1：</span></a></h3><p>如下代码的输出结果是什么？</p><div class="language-Java line-numbers-mode" data-ext="Java" data-title="Java"><pre class="language-Java"><code>public class Test1 {
    public static void main(String[] args) {
        System.out.println(&quot;A&quot;);
        new Test1();
        new Test1();
    }

    public Test1(){
        System.out.println(&quot;B&quot;);
    }

    {
        System.out.println(&quot;C&quot;);
    }

    static {
        System.out.println(&quot;D&quot;);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>分析步骤：</p><p>1、执行main方法之前，先执行clinit指令。指令会输出D</p><p>2、执行main方法的字节码指令。指令会输出A</p><p>3、创建两个对象，会执行两次对象初始化的指令。这里会输出CB，源代码中输出C这行，被放到了对象初始化的一开始来执行。</p><p>所以最后的结果应该是DACBCB</p><div class="hint-container important"><p class="hint-container-title">clinit不会执行的几种情况</p><p>如下几种情况是不会进行初始化指令执行的：</p><p>1.无静态代码块且无静态变量赋值语句。</p><p>2.有静态变量的声明，但是没有赋值语句。<code>public static int a;</code></p><p>3.静态变量的定义使用final关键字，这类变量会在准备阶段直接进行初始化。 <code>public final static int a = 10;</code></p></div><h3 id="面试题2" tabindex="-1"><a class="header-anchor" href="#面试题2"><span>面试题2：</span></a></h3><p>如下代码的输出结果是什么？</p><div class="language-Java line-numbers-mode" data-ext="Java" data-title="Java"><pre class="language-Java"><code>public class Demo01 {
    public static void main(String[] args) {
        new B02();
        System.out.println(B02.a);
    }
}

class A02{
    static int a = 0;
    static {
        a = 1;
    }
}

class B02 extends A02{
    static {
        a = 2;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>分析步骤：</p><p>1、调用new创建对象，需要初始化B02，优先初始化父类。</p><p>2、执行A02的初始化代码，将a赋值为1。</p><p>3、B02初始化，将a赋值为2。</p><h5 id="变化" tabindex="-1"><a class="header-anchor" href="#变化"><span>变化</span></a></h5><p>将<code>new B02();</code>注释掉会怎么样？</p><p>分析步骤：</p><p>1、访问父类的静态变量，只初始化父类。</p><p>2、执行A02的初始化代码，将a赋值为1。</p><h4 id="补充练习题" tabindex="-1"><a class="header-anchor" href="#补充练习题"><span>补充练习题</span></a></h4><p>分析如下代码执行结果:</p><div class="language-Java line-numbers-mode" data-ext="Java" data-title="Java"><pre class="language-Java"><code>public class Test2 {
    public static void main(String[] args) {
        Test2_A[] arr = new Test2_A[10];

    }
}

class Test2_A {
    static {
        System.out.println(&quot;Test2 A的静态代码块运行&quot;);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>数组的创建不会导致数组中元素的类进行初始化。</p><div class="language-Java line-numbers-mode" data-ext="Java" data-title="Java"><pre class="language-Java"><code>public class Test4 {
    public static void main(String[] args) {
        System.out.println(Test4_A.a);
    }
}

class Test4_A {
    public static final int a = Integer.valueOf(1);

    static {
        System.out.println(&quot;Test3 A的静态代码块运行&quot;);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>final修饰的变量如果赋值的内容需要执行指令才能得出结果，会执行clinit方法进行初始化。</p><h2 id="二、类加载器" tabindex="-1"><a class="header-anchor" href="#二、类加载器"><span>二、类加载器</span></a></h2><h3 id="_1、-什么是类加载器" tabindex="-1"><a class="header-anchor" href="#_1、-什么是类加载器"><span>1、 什么是类加载器</span></a></h3><p>类加载器（ClassLoader）是Java虚拟机提供给应用程序去实现获取类和接口字节码数据的技术，类加载器只参与加载过程中的字节码获取并加载到内存这一部分。</p><figure><img src="`+b+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>类加载器会通过二进制流的方式获取到字节码文件的内容，接下来将获取到的数据交给Java虚拟机，虚拟机会在方法区和堆上生成对应的对象保存字节码信息。</p><h3 id="_2、类加载器的分类" tabindex="-1"><a class="header-anchor" href="#_2、类加载器的分类"><span>2、类加载器的分类</span></a></h3><p>类加载器分为两类，一类是Java代码中实现的，一类是Java虚拟机底层源码实现的。</p><ul><li>虚拟机底层实现：源代码位于Java虚拟机的源码中，实现语言与虚拟机底层语言一致，比如Hotspot使用C++。主要目的是保证Java程序运行中基础类被正确地加载，比如java.lang.String，Java虚拟机需要确保其可靠性。</li><li>JDK中默认提供或者自定义：JDK中默认提供了多种处理不同渠道的类加载器，程序员也可以自己根据需求定制，使用Java语言。所有Java中实现的类加载器都需要继承ClassLoader这个抽象类。</li></ul><p>类加载器的设计JDK8和8之后的版本差别较大，首先来看JDK8及之前的版本，这些版本中默认的类加载器有如下几种：</p><figure><img src="'+h+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>类加载器的详细信息可以通过Arthas的classloader命令查看：</p><blockquote><p><code>classloader</code> - 查看 classloader 的继承树，urls，类加载信息，使用 classloader 去 getResource</p></blockquote><figure><img src="'+f+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><ul><li>BootstrapClassLoader是启动类加载器，numberOfInstances是类加载器的数量只有1个，loadedCountTotal是加载类的数量1861个。</li><li>ExtClassLoader是扩展类加载器</li><li>AppClassLoader是应用程序类加载器</li></ul><h3 id="_3、启动类加载器" tabindex="-1"><a class="header-anchor" href="#_3、启动类加载器"><span>3、启动类加载器</span></a></h3><ul><li>启动类加载器（Bootstrap ClassLoader）是由Hotspot虚拟机提供的、使用C++编写的类加载器。</li><li>默认加载Java安装目录/jre/lib下的类文件，比如rt.jar，tools.jar，resources.jar等。</li></ul><p>运行如下代码：</p><div class="language-Java line-numbers-mode" data-ext="Java" data-title="Java"><pre class="language-Java"><code>/**
 * 启动程序类加载器案例
 */
public class BootstrapClassLoaderDemo {
    public static void main(String[] args) throws IOException {
        ClassLoader classLoader = String.class.getClassLoader();
        System.out.println(classLoader);

        System.in.read();
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码通过String类获取到它的类加载器并且打印，结果是<code>null</code>。这是因为启动类加载器在JDK8中是由C++语言来编写的，在Java代码中去获取既不适合也不安全，所以才返回<code>null</code></p><p>在Arthas中可以通过<code>sc -d 类名</code>的方式查看加载这个类的类加载器详细的信息，比如：</p><figure><img src="`+j+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>通过上图可以看到，java.lang.String类的类加载器是空的，Hash值也是null。</p><p><strong>用户扩展基础jar包</strong></p><p>如果用户想扩展一些比较基础的jar包，让启动类加载器加载，有两种途径：</p><ul><li><strong>放入jre/lib下进行扩展</strong>。不推荐，尽可能不要去更改JDK安装目录中的内容，会出现即时放进去由于文件名不匹配的问题也不会正常地被加载。</li><li>**使用参数进行扩展。**推荐，使用<code>-Xbootclasspath/a:jar包目录/jar包名</code> 进行扩展，参数中的/a代表新增。</li></ul><p>在IDEA配置中添加虚拟机参数，就可以加载<code>D:/jvm/jar/classloader-test.jar</code>这个jar包了。</p><h3 id="_4、扩展类加载器和应用程序类加载器" tabindex="-1"><a class="header-anchor" href="#_4、扩展类加载器和应用程序类加载器"><span>4、扩展类加载器和应用程序类加载器</span></a></h3><ul><li>扩展类加载器和应用程序类加载器都是JDK中提供的、使用Java编写的类加载器。</li><li>它们的源码都位于sun.misc.Launcher中，是一个静态内部类。继承自URLClassLoader。具备通过目录或者指定jar包将字节码文件加载到内存中。</li></ul><p>继承关系图如下：</p><figure><img src="'+_+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><ul><li>ClassLoader类定义了具体的行为模式，简单来说就是先从本地或者网络获得字节码信息，然后调用虚拟机底层的方法创建方法区和堆上的对象。这样的好处就是让子类只需要去实现如何获取字节码信息这部分代码。</li><li>SecureClassLoader提供了证书机制，提升了安全性。</li><li>URLClassLoader提供了根据URL获取目录下或者指定jar包进行加载，获取字节码的数据。</li><li>扩展类加载器和应用程序类加载器继承自URLClassLoader，获得了上述的三种能力。</li></ul><p><strong>扩展类加载器</strong></p><p>扩展类加载器（Extension Class Loader）是JDK中提供的、使用Java编写的类加载器。默认加载Java安装目录/jre/lib/ext下的类文件。</p><p>如下代码会打印ScriptEnvironment类的类加载器。ScriptEnvironment是nashorn框架中用来运行javascript语言代码的环境类，他位于nashorn.jar包中被扩展类加载器加载</p><div class="language-Java line-numbers-mode" data-ext="Java" data-title="Java"><pre class="language-Java"><code>/**
 * 扩展类加载器
 */
public class ExtClassLoaderDemo {
    public static void main(String[] args) throws IOException {
        ClassLoader classLoader = ScriptEnvironment.class.getClassLoader();
        System.out.println(classLoader);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过扩展类加载器去加载用户jar包：</p><ul><li><strong>放入/jre/lib/ext下进行扩展</strong>。不推荐，尽可能不要去更改JDK安装目录中的内容。</li><li><strong>使用参数进行扩展使用参数进行扩展</strong>。推荐，使用<code>-Djava.ext.dirs=jar包目录</code> 进行扩展,这种方式会覆盖掉原始目录，可以用<code>;(windows):(macos/linux)</code>追加上原始目录</li></ul><p><strong>使用<code>引号</code>将整个地址包裹起来，这样路径中即便是有空格也不需要额外处理。路径中要包含原来ext文件夹，同时在最后加上扩展的路径。</strong></p><h3 id="_5、应用程序加载器" tabindex="-1"><a class="header-anchor" href="#_5、应用程序加载器"><span>5、应用程序加载器</span></a></h3><p>应用程序类加载器会加载classpath下的类文件，默认加载的是项目中的类以及通过maven引入的第三方jar包中的类。</p><p>如下案例中，打印出<code>Student</code>和<code>FileUtils</code>的类加载器：</p><div class="language-Java line-numbers-mode" data-ext="Java" data-title="Java"><pre class="language-Java"><code>/**
 * 应用程序类加载器案例
 */
public class AppClassLoaderDemo {
    public static void main(String[] args) throws IOException, InterruptedException {
        //当前项目中创建的Student类
        Student student = new Student();
        ClassLoader classLoader = Student.class.getClassLoader();
        System.out.println(classLoader);

        //maven依赖中包含的类
        ClassLoader classLoader1 = FileUtils.class.getClassLoader();
        System.out.println(classLoader1);

        Thread.sleep(1000);
        System.in.read();

    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这两个类均由应用程序类加载器加载。</p><p>类加载器的加载路径可以通过classloader –c hash值 查看：</p><figure><img src="`+x+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="三、双亲委派机制" tabindex="-1"><a class="header-anchor" href="#三、双亲委派机制"><span>三、双亲委派机制</span></a></h2><h3 id="_1、什么是双亲委派机制" tabindex="-1"><a class="header-anchor" href="#_1、什么是双亲委派机制"><span>1、什么是双亲委派机制</span></a></h3><p><strong>双亲委派机制指的是：当一个类加载器接收到加载类的任务时，会自底向上查找是否加载过，再由顶向下进行加载。</strong></p><figure><img src="'+J+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>详细流程：</p><p>每个类加载器都有一个父类加载器。父类加载器的关系如下，启动类加载器没有父类加载器：</p><figure><img src="'+y+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>在类加载的过程中，每个类加载器都会先检查是否已经加载了该类，如果已经加载则直接返回，否则会将加载请求委派给父类加载器。</p><h3 id="_2、双亲委派机制的作用" tabindex="-1"><a class="header-anchor" href="#_2、双亲委派机制的作用"><span>2、双亲委派机制的作用</span></a></h3><p>1.保证类加载的安全性。通过双亲委派机制避免恶意代码替换JDK中的核心类库，比如java.lang.String，确保核心类库的完整性和安全性。</p><p>2.避免重复加载。双亲委派机制可以避免同一个类被多次加载。</p><h3 id="_3、如何指定加载类的类加载器" tabindex="-1"><a class="header-anchor" href="#_3、如何指定加载类的类加载器"><span>3、如何指定加载类的类加载器？</span></a></h3><p>在Java中如何使用代码的方式去主动加载一个类呢？</p><p>**方式1：**使用Class.forName方法，使用当前类的类加载器去加载指定的类。</p><p>**方式2：**获取到类加载器，通过类加载器的loadClass方法指定某个类加载器加载。</p><p>例如：</p><figure><img src="'+C+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_4、三个问题" tabindex="-1"><a class="header-anchor" href="#_4、三个问题"><span>4、三个问题</span></a></h3><p>1、如果一个类重复出现在三个类加载器的加载位置，应该由谁来加载？</p><p>启动类加载器加载，根据双亲委派机制，它的优先级是最高的</p><p>2、String类能覆盖吗，在自己的项目中去创建一个java.lang.String类，会被加载吗？</p><p>不能，会返回启动类加载器加载在rt.jar包中的String类。</p><p>3、<strong>类的双亲委派机制是什么？</strong></p><ul><li>当一个类加载器去加载某个类的时候，会自底向上查找是否加载过，如果加载过就直接返回，如果一直到最顶层的类加载器都没有加载，再由顶向下进行加载。</li><li>应用程序类加载器的父类加载器是扩展类加载器，扩展类加载器的父类加载器是启动类加载器。</li><li>双亲委派机制的好处有两点：第一是避免恶意代码替换JDK中的核心类库，比如java.lang.String，确保核心类库的完整性和安全性。第二是避免一个类重复地被加载。</li></ul><h2 id="四、打破双亲委派机制" tabindex="-1"><a class="header-anchor" href="#四、打破双亲委派机制"><span>四、打破双亲委派机制</span></a></h2><p>打破双亲委派机制历史上有三种方式，但本质上只有第一种算是真正的打破了双亲委派机制：</p><ul><li>自定义类加载器并且重写loadClass方法。Tomcat通过这种方式实现应用之间类隔离。</li><li>线程上下文类加载器。利用上下文类加载器加载类，比如JDBC和JNDI等。</li><li>Osgi框架的类加载器。历史上Osgi框架实现了一套新的类加载器机制，允许同级之间委托进行类的加载，目前很少使用。</li></ul><h3 id="_1、自定义类加载器" tabindex="-1"><a class="header-anchor" href="#_1、自定义类加载器"><span>1、自定义类加载器</span></a></h3><p>一个Tomcat程序中是可以运行多个Web应用的，如果这两个应用中出现了相同限定名的类，比如Servlet类，Tomcat要保证这两个类都能加载并且它们应该是不同的类。如果不打破双亲委派机制，当应用类加载器加载Web应用1中的MyServlet之后，Web应用2中相同限定名的MyServlet类就无法被加载了。</p><figure><img src="'+S+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>Tomcat使用了自定义类加载器来实现应用之间类的隔离。 每一个应用会有一个独立的类加载器加载对应的类。</strong></p><p>那么自定义加载器是如何能做到的呢？首先我们需要先了解，双亲委派机制的代码到底在哪里，接下来只需要把这段代码消除即可。</p><p>ClassLoader中包含了4个核心方法，双亲委派机制的核心代码就位于loadClass方法中。</p><div class="language-Java line-numbers-mode" data-ext="Java" data-title="Java"><pre class="language-Java"><code>public Class&lt;?&gt; loadClass(String name)
类加载的入口，提供了双亲委派机制。内部会调用findClass   重要

protected Class&lt;?&gt; findClass(String name)
由类加载器子类实现,获取二进制数据调用defineClass ，比如URLClassLoader会根据文件路径去获取类文件中的二进制数据。重要

protected final Class&lt;?&gt; defineClass(String name, byte[] b, int off, int len)
做一些类名的校验，然后调用虚拟机底层的方法将字节码信息加载到虚拟机内存中

protected final void resolveClass(Class&lt;?&gt; c)
执行类生命周期中的连接阶段
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>1、入口方法：</p><figure><img src="`+L+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>2、再进入看下：</p><figure><img src="'+D+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>如果查找都失败，进入加载阶段，首先会由启动类加载器加载，这段代码在<code>findBootstrapClassOrNull</code>中。如果失败会抛出异常，接下来执行下面这段代码：</p><figure><img src="'+q+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>父类加载器加载失败就会抛出异常，回到子类加载器的这段代码，这样就实现了加载并向下传递。</p><p>3、最后根据传入的参数判断是否进入连接阶段：</p><p>接下来实现打破双亲委派机制：</p><div class="language-Java line-numbers-mode" data-ext="Java" data-title="Java"><pre class="language-Java"><code>package classloader.broken;//package com.itheima.jvm.chapter02.classloader.broken;

import org.apache.commons.io.IOUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.ProtectionDomain;
import java.util.regex.Matcher;

/**
 * 打破双亲委派机制 - 自定义类加载器
 */

public class BreakClassLoader1 extends ClassLoader {

    private String basePath;
    private final static String FILE_EXT = &quot;.class&quot;;

    //设置加载目录
    public void setBasePath(String basePath) {
        this.basePath = basePath;
    }

    //使用commons io 从指定目录下加载文件
    private byte[] loadClassData(String name)  {
        try {
            String tempName = name.replaceAll(&quot;\\\\.&quot;, Matcher.quoteReplacement(File.separator));
            FileInputStream fis = new FileInputStream(basePath + tempName + FILE_EXT);
            try {
                return IOUtils.toByteArray(fis);
            } finally {
                IOUtils.closeQuietly(fis);
            }

        } catch (Exception e) {
            System.out.println(&quot;自定义类加载器加载失败，错误原因：&quot; + e.getMessage());
            return null;
        }
    }

    //重写loadClass方法
    @Override
    public Class&lt;?&gt; loadClass(String name) throws ClassNotFoundException {
        //如果是java包下，还是走双亲委派机制
        if(name.startsWith(&quot;java.&quot;)){
            return super.loadClass(name);
        }
        //从磁盘中指定目录下加载
        byte[] data = loadClassData(name);
        //调用虚拟机底层方法，方法区和堆区创建对象
        return defineClass(name, data, 0, data.length);
    }

    public static void main(String[] args) throws ClassNotFoundException, InstantiationException, IllegalAccessException, IOException {
        //第一个自定义类加载器对象
        BreakClassLoader1 classLoader1 = new BreakClassLoader1();
        classLoader1.setBasePath(&quot;D:\\\\lib\\\\&quot;);

        Class&lt;?&gt; clazz1 = classLoader1.loadClass(&quot;com.itheima.my.A&quot;);
         //第二个自定义类加载器对象
        BreakClassLoader1 classLoader2 = new BreakClassLoader1();
        classLoader2.setBasePath(&quot;D:\\\\lib\\\\&quot;);

        Class&lt;?&gt; clazz2 = classLoader2.loadClass(&quot;com.itheima.my.A&quot;);

        System.out.println(clazz1 == clazz2);

        Thread.currentThread().setContextClassLoader(classLoader1);

        System.out.println(Thread.currentThread().getContextClassLoader());

        System.in.read();
     }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>自定义类加载器父类怎么是AppClassLoader呢？</strong></p><p>默认情况下自定义类加载器的父类加载器是应用程序类加载器：</p><figure><img src="`+B+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>以Jdk8为例，ClassLoader类中提供了构造方法设置parent的内容：</p><figure><img src="'+E+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>这个构造方法由另外一个构造方法调用，其中父类加载器由getSystemClassLoader方法设置，该方法返回的是AppClassLoader。</p><figure><img src="'+z+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>两个自定义类加载器加载相同限定名的类，不会冲突吗？</strong></p><p>不会冲突，在同一个Java虚拟机中，只有相同类加载器+相同的类限定名才会被认为是同一个类。</p><p>在Arthas中使用sc –d 类名的方式查看具体的情况。</p><p>如下代码：</p><div class="language-Java line-numbers-mode" data-ext="Java" data-title="Java"><pre class="language-Java"><code> public static void main(String[] args) throws ClassNotFoundException, InstantiationException, IllegalAccessException, IOException {
        //第一个自定义类加载器对象
        BreakClassLoader1 classLoader1 = new BreakClassLoader1();
        classLoader1.setBasePath(&quot;D:\\\\lib\\\\&quot;);

        Class&lt;?&gt; clazz1 = classLoader1.loadClass(&quot;com.itheima.my.A&quot;);
         //第二个自定义类加载器对象
        BreakClassLoader1 classLoader2 = new BreakClassLoader1();
        classLoader2.setBasePath(&quot;D:\\\\lib\\\\&quot;);

        Class&lt;?&gt; clazz2 = classLoader2.loadClass(&quot;com.itheima.my.A&quot;);

        System.out.println(clazz1 == clazz2);
     }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>打印的应该是false，因为两个类加载器不同，尽管加载的是同一个类名，最终Class对象也不是相同的。</p><h3 id="_2、线程上下文类加载器" tabindex="-1"><a class="header-anchor" href="#_2、线程上下文类加载器"><span>2、线程上下文类加载器</span></a></h3><p>利用上下文类加载器加载类，比如JDBC和JNDI等。</p><p>我们来看下JDBC的案例：</p><p>1、JDBC中使用了DriverManager来管理项目中引入的不同数据库的驱动，比如mysql驱动、oracle驱动。</p><div class="language-Java line-numbers-mode" data-ext="Java" data-title="Java"><pre class="language-Java"><code>package classloader.broken;//package com.itheima.jvm.chapter02.classloader.broken;

import com.mysql.cj.jdbc.Driver;

import java.sql.*;

/**
 * 打破双亲委派机制 - JDBC案例
 */

public class JDBCExample {
    // JDBC driver name and database URL
    static final String JDBC_DRIVER = &quot;com.mysql.cj.jdbc.Driver&quot;;
    static final String DB_URL = &quot;jdbc:mysql:///bank1&quot;;

    //  Database credentials
    static final String USER = &quot;root&quot;;
    static final String PASS = &quot;123456&quot;;

    public static void main(String[] args) {
        Connection conn = null;
        Statement stmt = null;
        try {
            conn = DriverManager.getConnection(DB_URL, USER, PASS);
            stmt = conn.createStatement();
            String sql;
            sql = &quot;SELECT id, account_name FROM account_info&quot;;
            ResultSet rs = stmt.executeQuery(sql);

            //STEP 4: Extract data from result set
            while (rs.next()) {
                //Retrieve by column name
                int id = rs.getInt(&quot;id&quot;);
                String name = rs.getString(&quot;account_name&quot;);

                //Display values
                System.out.print(&quot;ID: &quot; + id);
                System.out.print(&quot;, Name: &quot; + name + &quot;\\n&quot;);
            }
            //STEP 5: Clean-up environment
            rs.close();
            stmt.close();
            conn.close();
        } catch (SQLException se) {
            //Handle errors for JDBC
            se.printStackTrace();
        } catch (Exception e) {
            //Handle errors for Class.forName
            e.printStackTrace();
        } finally {
            //finally block used to close resources
            try {
                if (stmt != null)
                    stmt.close();
            } catch (SQLException se2) {
            }// nothing we can do
            try {
                if (conn != null)
                    conn.close();
            } catch (SQLException se) {
                se.printStackTrace();
            }//end finally try
        }//end try
    }//end main
}//end FirstExample
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、DriverManager类位于rt.jar包中，由启动类加载器加载。</p><figure><img src="`+k+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>3、依赖中的mysql驱动对应的类，由应用程序类加载器来加载。</p><figure><img src="'+A+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>在类中有初始化代码：</p><figure><img src="'+T+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>DriverManager属于rt.jar是启动类加载器加载的。而用户jar包中的驱动需要由应用类加载器加载，<em>这就违反了双亲委派机制</em>。（这点存疑，一会儿再讨论）</p><p>那么问题来了，DriverManager怎么知道jar包中要加载的驱动在哪儿？</p><p>1、在类的初始化代码中有这么一个方法<code>LoadInitialDrivers</code>：</p><figure><img src="'+I+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>2、这里使用了SPI机制，去加载所有jar包中实现了Driver接口的实现类。</p><figure><img src="'+w+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>3、SPI机制就是在这个位置下存放了一个文件，文件名是接口名，文件里包含了实现类的类名。这样SPI机制就可以找到实现类了。</p><figure><img src="'+O+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="'+P+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>4、SPI中利用了线程上下文类加载器（应用程序类加载器）去加载类并创建对象。</p><figure><img src="'+R+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>总结：</p><figure><img src="'+N+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>JDBC案例中真的打破了双亲委派机制吗？</strong></p><p>最早这个论点提出是在周志明《深入理解Java虚拟机》中，他认为打破了双亲委派机制，这种由启动类加载器加载的类，委派应用程序类加载器去加载类的方式，所以打破了双亲委派机制。</p><p>但是如果我们分别从DriverManager以及驱动类的加载流程上分析，JDBC只是在DriverManager加载完之后，通过初始化阶段触发了驱动类的加载，类的加载依然遵循双亲委派机制。</p><p>所以我认为这里没有打破双亲委派机制，只是用一种巧妙的方法让启动类加载器加载的类，去引发的其他类的加载。</p><h3 id="_3、osgi框架的类加载器" tabindex="-1"><a class="header-anchor" href="#_3、osgi框架的类加载器"><span>3、Osgi框架的类加载器</span></a></h3><p>历史上，OSGi模块化框架。它存在同级之间的类加载器的委托加载。OSGi还使用类加载器实现了热部署的功能。热部署指的是在服务不停止的情况下，动态地更新字节码文件到内存中。</p><figure><img src="'+F+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>由于这种机制使用已经不多，所以不再过多讨论OSGi，着重来看下热部署在实际项目中的应用。</p><h3 id="案例-使用阿里arthas不停机解决线上问题" tabindex="-1"><a class="header-anchor" href="#案例-使用阿里arthas不停机解决线上问题"><span>案例：使用阿里arthas不停机解决线上问题</span></a></h3><p><strong>背景：</strong></p><p>小李的团队将代码上线之后，发现存在一个小bug，但是用户急着使用，如果重新打包再发布需要一个多小时的时间，所以希望能使用arthas尽快的将这个问题修复。</p><p><strong>思路：</strong></p><ol><li>在出问题的服务器上部署一个 arthas，并启动。</li><li><code>jad --source-only 类全限定名 &gt; 目录/文件名.java </code> jad 命令反编译，然后可以用其它编译器，比如 vim 来修改源码</li><li><code>mc –c 类加载器的hashcode 目录/文件名.java -d 输出目录</code> mc 命令用来编译修改过的代码</li><li><code> retransform class文件所在目录/xxx.class</code> 用 retransform 命令加载新的字节码</li></ol><p><strong>注意事项：</strong></p><p>1、程序重启之后，字节码文件会恢复，除非将class文件放入jar包中进行更新。</p><p>2、使用retransform不能添加方法或者字段，也不能更新正在执行中的方法。</p><h2 id="五、jdk9之后的类加载器" tabindex="-1"><a class="header-anchor" href="#五、jdk9之后的类加载器"><span>五、JDK9之后的类加载器</span></a></h2><p>JDK8及之前的版本中，扩展类加载器和应用程序类加载器的源码位于rt.jar包中的sun.misc.Launcher.java。</p><figure><img src="'+K+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>由于JDK9引入了module的概念，类加载器在设计上发生了很多变化。</p><p>1.启动类加载器使用Java编写，位于jdk.internal.loader.ClassLoaders类中。</p><p>Java中的BootClassLoader继承自BuiltinClassLoader实现从模块中找到要加载的字节码资源文件。</p><p>启动类加载器依然无法通过java代码获取到，返回的仍然是null，保持了统一。</p><p>2、扩展类加载器被替换成了平台类加载器（Platform Class Loader）。</p><p>​ 平台类加载器遵循模块化方式加载字节码文件，所以继承关系从URLClassLoader变成了BuiltinClassLoader，BuiltinClassLoader实现了从模块中加载字节码文件。平台类加载器的存在更多的是为了与老版本的设计方案兼容，自身没有特殊的逻辑。</p>',235);function H(W,Z){return s(),a("div",null,[e("more-"),U])}const V=i(M,[["render",H],["__file","3-类加载器.html.vue"]]),G=JSON.parse('{"path":"/posts/%E5%90%8E%E7%AB%AF/Java/3-%E7%B1%BB%E5%8A%A0%E8%BD%BD%E5%99%A8.html","title":"类加载器","lang":"zh-CN","frontmatter":{"title":"类加载器","date":"2024-09-08T16:40:22.000Z","tags":"java","category":"Java","icon":"/img/JVM.svg","order":3,"description":"类加载器 一、类的生命周期 类的生命周期描述了一个类加载、使用、卸载的整个过程。整体可以分为： 加载 连接，其中又分为验证、准备、解析三个子阶段 初始化 使用 卸载 1、 加载阶段 1、加载(Loading)阶段第一步是类加载器根据类的全限定名通过不同的渠道以二进制流的方式获取字节码信息，程序员可以使用Java代码拓展的不同的渠道。 从本地磁盘上获取文...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/posts/%E5%90%8E%E7%AB%AF/Java/3-%E7%B1%BB%E5%8A%A0%E8%BD%BD%E5%99%A8.html"}],["meta",{"property":"og:site_name","content":"Lance"}],["meta",{"property":"og:title","content":"类加载器"}],["meta",{"property":"og:description","content":"类加载器 一、类的生命周期 类的生命周期描述了一个类加载、使用、卸载的整个过程。整体可以分为： 加载 连接，其中又分为验证、准备、解析三个子阶段 初始化 使用 卸载 1、 加载阶段 1、加载(Loading)阶段第一步是类加载器根据类的全限定名通过不同的渠道以二进制流的方式获取字节码信息，程序员可以使用Java代码拓展的不同的渠道。 从本地磁盘上获取文..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://mister-hope.github.io/image\\\\jvm\\\\jvm31.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-09-08T08:01:25.000Z"}],["meta",{"property":"article:author","content":"RuyiWei"}],["meta",{"property":"article:published_time","content":"2024-09-08T16:40:22.000Z"}],["meta",{"property":"article:modified_time","content":"2024-09-08T08:01:25.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"类加载器\\",\\"image\\":[\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm31.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm32.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm33.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm34.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm35.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm36.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm37.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm38.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm39.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm40.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm41.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm42.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm43.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm44.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm45.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm46.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm47.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm48.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm49.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm50.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm51.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm52.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm53.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm54.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm55.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm56.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm57.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm58.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm59.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm60.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm61.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm62.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm63.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm64.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm65.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm66.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm67.png\\",\\"https://mister-hope.github.io/image\\\\\\\\jvm\\\\\\\\jvm68.png\\"],\\"datePublished\\":\\"2024-09-08T16:40:22.000Z\\",\\"dateModified\\":\\"2024-09-08T08:01:25.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"RuyiWei\\"}]}"]]},"headers":[{"level":2,"title":"一、类的生命周期","slug":"一、类的生命周期","link":"#一、类的生命周期","children":[{"level":3,"title":"1、 加载阶段","slug":"_1、-加载阶段","link":"#_1、-加载阶段","children":[]},{"level":3,"title":"2、 连接阶段","slug":"_2、-连接阶段","link":"#_2、-连接阶段","children":[]},{"level":3,"title":"3、 初始化阶段","slug":"_3、-初始化阶段","link":"#_3、-初始化阶段","children":[]},{"level":3,"title":"面试题1：","slug":"面试题1","link":"#面试题1","children":[]},{"level":3,"title":"面试题2：","slug":"面试题2","link":"#面试题2","children":[]}]},{"level":2,"title":"二、类加载器","slug":"二、类加载器","link":"#二、类加载器","children":[{"level":3,"title":"1、 什么是类加载器","slug":"_1、-什么是类加载器","link":"#_1、-什么是类加载器","children":[]},{"level":3,"title":"2、类加载器的分类","slug":"_2、类加载器的分类","link":"#_2、类加载器的分类","children":[]},{"level":3,"title":"3、启动类加载器","slug":"_3、启动类加载器","link":"#_3、启动类加载器","children":[]},{"level":3,"title":"4、扩展类加载器和应用程序类加载器","slug":"_4、扩展类加载器和应用程序类加载器","link":"#_4、扩展类加载器和应用程序类加载器","children":[]},{"level":3,"title":"5、应用程序加载器","slug":"_5、应用程序加载器","link":"#_5、应用程序加载器","children":[]}]},{"level":2,"title":"三、双亲委派机制","slug":"三、双亲委派机制","link":"#三、双亲委派机制","children":[{"level":3,"title":"1、什么是双亲委派机制","slug":"_1、什么是双亲委派机制","link":"#_1、什么是双亲委派机制","children":[]},{"level":3,"title":"2、双亲委派机制的作用","slug":"_2、双亲委派机制的作用","link":"#_2、双亲委派机制的作用","children":[]},{"level":3,"title":"3、如何指定加载类的类加载器？","slug":"_3、如何指定加载类的类加载器","link":"#_3、如何指定加载类的类加载器","children":[]},{"level":3,"title":"4、三个问题","slug":"_4、三个问题","link":"#_4、三个问题","children":[]}]},{"level":2,"title":"四、打破双亲委派机制","slug":"四、打破双亲委派机制","link":"#四、打破双亲委派机制","children":[{"level":3,"title":"1、自定义类加载器","slug":"_1、自定义类加载器","link":"#_1、自定义类加载器","children":[]},{"level":3,"title":"2、线程上下文类加载器","slug":"_2、线程上下文类加载器","link":"#_2、线程上下文类加载器","children":[]},{"level":3,"title":"3、Osgi框架的类加载器","slug":"_3、osgi框架的类加载器","link":"#_3、osgi框架的类加载器","children":[]},{"level":3,"title":"案例：使用阿里arthas不停机解决线上问题","slug":"案例-使用阿里arthas不停机解决线上问题","link":"#案例-使用阿里arthas不停机解决线上问题","children":[]}]},{"level":2,"title":"五、JDK9之后的类加载器","slug":"五、jdk9之后的类加载器","link":"#五、jdk9之后的类加载器","children":[]}],"git":{"createdTime":1725782485000,"updatedTime":1725782485000,"contributors":[{"name":"weiruyi","email":"1581778251@qq.com","commits":1}]},"readingTime":{"minutes":22.34,"words":6703},"filePathRelative":"posts/后端/Java/3-类加载器.md","localizedDate":"2024年9月8日","excerpt":"<!--more--->\\n<h1>类加载器</h1>\\n<h2>一、类的生命周期</h2>\\n<p>类的生命周期描述了一个类加载、使用、卸载的整个过程。整体可以分为：</p>\\n<ul>\\n<li>加载</li>\\n<li>连接，其中又分为验证、准备、解析三个子阶段</li>\\n<li>初始化</li>\\n<li>使用</li>\\n<li>卸载</li>\\n</ul>\\n<figure><img src=\\"/image\\\\jvm\\\\jvm31.png\\" alt=\\"\\" tabindex=\\"0\\" loading=\\"lazy\\"><figcaption></figcaption></figure>\\n<h3>1、 加载阶段</h3>","autoDesc":true}');export{V as comp,G as data};
