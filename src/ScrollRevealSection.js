import { useEffect, useRef } from "react";

const IMPACTS = [
  {
    age: "Ages 6–8 · Early Childhood",
    title: "Attention fragments before it forms.",
    text: "Excessive screen exposure during early development competes with the slow, deliberate focus children need to build. Constant stimulation rewires the brain's reward system around novelty, making sustained attention feel uncomfortable.",
    stat: "Children with 2+ hours of daily screen time show <strong>30% lower scores</strong> on attention assessments.",
    link: "https://www.aap.org/en/patient-care/media-and-children/",
    linkLabel: "AAP · Media and Children",
  },
  {
    age: "Ages 9–11 · Middle Childhood",
    title: "Real friendships get harder to make.",
    text: "When social interaction moves to screens, kids miss out on reading facial expressions, body language, and emotional nuance. The result: rising social anxiety and difficulty navigating in-person friendships that used to come naturally.",
    stat: "Face-to-face social skills decline by an estimated <strong>40%</strong> with heavy device use.",
    link: "https://www.apa.org/topics/social-media-internet/technology-use-children",
    linkLabel: "APA · Technology Use in Children",
  },
  {
    age: "Ages 12–14 · Early Adolescence",
    title: "Sleep, mood, and identity erode.",
    text: "Blue light suppresses melatonin. Social media triggers dopamine loops. Self-image gets shaped by curated highlight reels of strangers. The teenage brain — already in flux — absorbs this pressure as truth.",
    stat: "Teens averaging 5+ hours daily are <strong>71% more likely</strong> to report depressive symptoms.",
    link: "https://www.hhs.gov/surgeongeneral/priorities/youth-mental-health/social-media/index.html",
    linkLabel: "U.S. Surgeon General · Social Media & Youth",
  },
  {
    age: "Ages 15–17 · Mid Adolescence",
    title: "Impulsivity outruns judgment.",
    text: "The prefrontal cortex develops slower than the dopamine-driven reward circuits screens activate. Heavy users show measurably weaker impulse control, more risk-taking behavior, and difficulty delaying gratification well into adulthood.",
    stat: "Impulsivity scores rise <strong>up to 60%</strong> in adolescents with addictive phone use patterns.",
    link: "https://www.nih.gov/news-events/nih-research-matters/brain-changes-young-people-heavy-screen-time",
    linkLabel: "NIH · Screen Time & the Adolescent Brain",
  },
  {
    age: "Ages 18–21 · Emerging Adulthood",
    title: "The cost compounds quietly.",
    text: "By young adulthood, the patterns are wired in: shorter attention, weaker social muscles, dysregulated sleep, fragile self-worth. These aren't permanent — but reversing them requires deliberate effort the digital environment is designed to prevent.",
    stat: "Loneliness in young adults has <strong>doubled</strong> in the past two decades.",
    link: "https://www.cdc.gov/emotional-wellbeing/social-connectedness/loneliness.htm",
    linkLabel: "CDC · Loneliness and Social Isolation",
  },
  {
    age: "Ages 22–24 · The Long Tail",
    title: "Adaptability narrows.",
    text: "Adults who grew up immersed in screens often report difficulty tolerating boredom, sitting with discomfort, or engaging deeply with one task. The very flexibility childhood was meant to build becomes the casualty of always-on technology.",
    stat: "Adaptability and resilience markers drop <strong>significantly</strong> in lifelong heavy users.",
    link: "https://www.who.int/news-room/fact-sheets/detail/adolescent-mental-health",
    linkLabel: "WHO · Adolescent Mental Health",
  },
];

export default function ScrollRevealSection() {
  const cardsRef = useRef([]);
  const backToTopRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -80px 0px" }
    );

    cardsRef.current.forEach((el) => el && observer.observe(el));
    if (backToTopRef.current) observer.observe(backToTopRef.current);
    return () => observer.disconnect();
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="scroll-reveal-section">
      <div className="scroll-reveal-intro">
        <h2>What the data quietly shows.</h2>
        <p>The hidden cost of growing up on screens</p>
      </div>

      {IMPACTS.map((item, i) => (
        <article
          key={i}
          ref={(el) => (cardsRef.current[i] = el)}
          className="reveal-card"
        >
          <span className="reveal-age">{item.age}</span>
          <h3 className="reveal-title">{item.title}</h3>
          <p className="reveal-text">{item.text}</p>
          <p
            className="reveal-stat"
            dangerouslySetInnerHTML={{ __html: item.stat }}
          />
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="reveal-learn-more"
          >
            <span>Learn more</span>
            <span className="reveal-learn-more-arrow" aria-hidden="true">→</span>
            <span className="reveal-learn-more-source">{item.linkLabel}</span>
          </a>
        </article>
      ))}

      <div
        ref={backToTopRef}
        className="reveal-card back-to-top-card"
      >
        <span className="reveal-age">End of the thread</span>
        <h3 className="reveal-title">Return to the simulation.</h3>
        <p className="reveal-text">
          The data is heavy — but the patterns aren't fixed. Go back and explore how
          choices at each age shape the path forward.
        </p>
        <button
          type="button"
          onClick={handleBackToTop}
          className="back-to-top-btn"
        >
          <span className="back-to-top-arrow" aria-hidden="true">↑</span>
          <span>Back to the top</span>
        </button>
      </div>
    </section>
  );
}
