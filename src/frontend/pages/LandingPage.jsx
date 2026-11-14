import React from 'react';
import Section from "../components/Section";
import homeBg from "../images/home-bg.jpg";
import ArrowCircleIcon from "../svg/ArrowCircleIcon";

const HERO_TITLE_LINES = ["SUPPORTING", "AGRICULTURE VIA", "VOLUNTEER", "ENGAGEMENT"];

function LandingPage() {
    return (
        <>
            <section id="Home">
                <div className="hero__content">
                    <h1 className="hero__title">
                        {HERO_TITLE_LINES.map((line) => (
                            <span className="hero__line" key={line}>
                                <span className="hero__initial">{line[0]}</span>
                                {line.slice(1)}
                            </span>
                        ))}
                    </h1>

                    <p className="hero__text">
                        Immerse yourself in the daily realities of Philippine agriculture to understand, appreciate, and actively sustain the future of food production.
                    </p>

                    <a className="cta-btn" href="#Register">
                        <span className="cta-btn__text">Get Involved</span>
                        <ArrowCircleIcon className="cta-btn__icon" />
                    </a>
                </div>

                <div className="home-image">
                    <img src={homeBg} alt="" />
                </div>
            </section>

            <Section id="About" tone="light" watermark="ABOUT">
                <h2 className="about-title">About Our Program</h2>

                <div className="about-row">
                    <div className="about-image">
                        <img src="frontend/images/about-img-1.jpg" alt="Students volunteering on farm" />
                    </div>
                    <div className="about-text">
                        <p>
                            SAVE is a program dedicated to promoting the agricultural industry in the Philippines by engaging college students from different schools in volunteer activities on local farms.
                        </p>
                    </div>
                </div>

                <div className="about-row-reverse">
                    <div className="about-image">
                        <img src="frontend/images/about-img-2.jpg" alt="Hands-on farming experience" />
                    </div>
                    <div className="about-text">
                        <p>
                            Through hands-on experience, students gain a deeper understanding of agriculture, develop a fresh perspective on the daily lives and challenges of Filipino farmers, and appreciate the vital role they play in the country's food production and agricultural development.
                        </p>
                    </div>
                </div>

                <div className="about-row">
                    <div className="about-image">
                        <img src="frontend/images/about-img-3.jpg" alt="Community impact" />
                    </div>
                    <div className="about-text">
                        <p>
                            By bridging the gap between urban youth and rural farmers, we aim to cultivate a new generation of agricultural advocates who can drive innovation and sustainable food security initiatives.
                        </p>
                    </div>
                </div>
            </Section>

            <Section id="WhyDoIt" tone="dark" watermark="GROW">
                <div className="why-do-it-header">
                    <span className="subtitle">why do it?</span>
                    <h2>YOUR COMMUNITY NEEDS YOU</h2>
                    <p>that is more than enough reason</p>
                </div>

                <div className="cards-container">
                    <div className="card">
                        <div className="card-icon">[ ICON ]</div>
                        <h3>GROWING FOOD INSECURITY</h3>
                        <p>
                            A dramatic drop in farm workers translates directly to an inability to maintain food <strong>self-sufficiency</strong>, forcing the country to rely heavily on expensive imported commodities.
                        </p>
                    </div>

                    <div className="card">
                        <div className="card-icon">[ ICON ]</div>
                        <h3>GRAYING WORKFORCE</h3>
                        <p>
                            The average age of the Filipino farmer ranges between <strong>57 and 59 years old</strong>. Experts predict a critical shortage of farmers within the next 10 to 12 years if younger generations do not step up.
                        </p>
                    </div>

                    <div className="card">
                        <div className="card-icon">[ ICON ]</div>
                        <h3>BREAKING STEREOTYPES</h3>
                        <p>
                            Agriculture is widely stigmatized in rural communities as an unprofitable, low-status, and physically exhausting <strong>"poor man's profession."</strong>
                        </p>
                    </div>
                </div>
            </Section>

            <Section id="Process" tone="mint" watermark="JOIN">
                <div className="process-header">
                    <span className="subtitle">how do i sign up?</span>
                    <h2>THE WHOLE PROCESS</h2>
                    <p>join the force in a few simple steps</p>
                </div>

                <div className="process-steps-container">
                    <div className="process-step-card">
                        <span className="step-number">01</span>
                        <div className="step-content">
                            <h3>Email & Number</h3>
                        </div>
                        <span className="step-arrow">&gt;</span>
                    </div>

                    <div className="process-step-card">
                        <span className="step-number">02</span>
                        <div className="step-content">
                            <h3>Farm Selection</h3>
                        </div>
                        <span className="step-arrow">&gt;</span>
                    </div>

                    <div className="process-step-card">
                        <span className="step-number">03</span>
                        <div className="step-content">
                            <h3>Confirm Match</h3>
                        </div>
                        <span className="step-arrow">&gt;</span>
                    </div>

                    <div className="process-step-card">
                        <span className="step-number">04</span>
                        <div className="step-content">
                            <h3>Receive Confirmation Feedback</h3>
                        </div>
                        <span className="step-arrow">&gt;</span>
                    </div>

                    <div className="process-step-card">
                        <span className="step-number">05</span>
                        <div className="step-content">
                            <h3>Keep In Touch</h3>
                        </div>
                        <span className="step-arrow">&gt;</span>
                    </div>
                </div>
            </Section>

            <Section id="Questions" tone="light" watermark="ASK">
                <div className="faq-header">
                    <span className="subtitle">you might be wondering...</span>
                    <h2>DIGGING DEEPER IN THE FIELD</h2>
                    <p>a couple questions you might have</p>
                </div>

                <div className="faq-grid">
                    <div className="faq-item">
                        <span className="faq-icon">+</span>
                        <p>Do I need to pay any registration or processing fees to sign up?</p>
                    </div>
                    <div className="faq-item">
                        <span className="faq-icon">+</span>
                        <p>Can I sign up as a group or do we have to apply individually?</p>
                    </div>
                    <div className="faq-item">
                        <span className="faq-icon">+</span>
                        <p>What should I pack or wear for the farm immersion?</p>
                    </div>
                    <div className="faq-item">
                        <span className="faq-icon">+</span>
                        <p>I have zero experience in farming. Can I still join?</p>
                    </div>
                    <div className="faq-item">
                        <span className="faq-icon">+</span>
                        <p>...</p>
                    </div>
                    <div className="faq-item">
                        <span className="faq-icon">+</span>
                        <p>...</p>
                    </div>
                </div>
            </Section>

            <Section id="Discover" tone="dark" watermark="HARVEST">
                <div className="ai-header">
                    <span className="subtitle">check out our predictions!</span>
                    <h2>NEXT GENERATION OF CROPS</h2>
                    <p>analytics meets crop optimization</p>
                </div>

                <div className="ai-content-box">
                    <p>
                        The latest development in Artificial Intelligence has made it possible for us to help the farmers even more by providing an AI prediction model that predicts which plants are most optimal to plant within that quarter of the year based on historical data regarding weather, price, and other external factors.
                    </p>
                    <div className="home-btn">
                        <button type="button">Learn More &rarr;</button>
                    </div>
                </div>
            </Section>
        </>
    );
}
export default LandingPage;