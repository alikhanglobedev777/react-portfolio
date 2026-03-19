import React, { useState } from "react";
import "../styles/blogs.css";
import profile from "../assets/profile.jpeg";

export default function Blogs() {
  const blogs = [
    {
      company: "Devfied",
      rating: 5,
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem totam voluptates facere obcaecati doloremque, molestiae optio, maiores iste mollitia odit perspiciatis, explicabo quis!",
      author: "Ali",
      role: "Mern developer at Devfied",
      img: profile,
    },
    {
      company: "Devfied",
      rating: 4,
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem totam voluptates facere obcaecati doloremque, molestiae optio, maiores iste mollitia odit perspiciatis, explicabo quis!",
      author: "Ali",
      role: "Mern developer at Devfied",
      img: profile,
    },
    {
      company: "Devfied",
      rating: 5,
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem totam voluptates facere obcaecati doloremque, molestiae optio, maiores iste mollitia odit perspiciatis, explicabo quis!",
      author: "Ali",
      role: "Mern developer at Devfied",
      img: profile,
    },
  ];

  const faqs = [
    {
      question: "Can I use your project for my clients?",
      answer: "Yes, our project can be customized and used for your client projects with proper attribution.",
    },
    {
      question: "Will growth products slow down my products?",
      answer: "Not at all! Our system is optimized for performance and scalability, so growth products won’t affect speed.",
    },
    {
      question: "How do I get Quotation for my project?",
      answer: "You can contact us via our website’s contact form, and we’ll prepare a detailed quotation based on your requirements.",
    },
    {
      question: "How many landing pages can I work with your project?",
      answer: "There’s no limit—you can create as many landing pages as you want with full flexibility.",
    },
    {
      question: "Is customer support available?",
      answer: "Yes, we provide 24/7 customer support to assist you with any queries or issues.",
    },
    {
      question: "Can I integrate your system into my existing website?",
      answer: "Yes, our system is modular and can be easily integrated into your existing website setup.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (ques) => {
    if (openIndex === ques) {
      setOpenIndex(null); 
    } else {
      setOpenIndex(ques);
    }
  };

  return (
    <section className="blogs">
    
      <div className="blogs-header">
        <span className="badge">Blogs</span>
        <h2 className="blogs-title">What Clients Are Saying</h2>
      </div>

      <div className="blogs-grid">
        {blogs.map((blog, index) => (
          <div className="blog-card" key={index}>
            <h3>{blog.company}</h3>
            <div className="stars">
              {"★".repeat(blog.rating)}
              {"☆".repeat(5 - blog.rating)}
            </div>
            <p className="blog-text">{blog.text}</p>
            <div className="blog-author">
              <img src={blog.img} alt={blog.author} className="author-img" />
              <div>
                <h4>{blog.author}</h4>
                <span>{blog.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    
      <div className="faq-section">
        <span className="badge">FAQ</span>
        <h2 className="faq-title">Your Questions and Answers</h2>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? "open" : ""}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <span>{faq.question}</span>
                <span className="faq-toggle">{openIndex === index ? "−" : "+"}</span>
              </div>
              {openIndex === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
