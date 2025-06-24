
import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Heart, Target, Eye, Users, Award, Globe } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Love",
      description: "We demonstrate Christ's love through our actions and relationships with one another."
    },
    {
      icon: Target,
      title: "Purpose",
      description: "Every member is equipped and empowered to fulfill their God-given purpose."
    },
    {
      icon: Eye,
      title: "Vision",
      description: "We see beyond the present to God's greater plan for our community and world."
    },
    {
      icon: Users,
      title: "Unity",
      description: "Together we are stronger, supporting each other in faith and fellowship."
    }
  ];

  const leadership = [
    {
      name: "Pastor John Smith",
      role: "Senior Pastor",
      description: "Leading our congregation with wisdom and compassion for over 15 years.",
      image: "Senior pastor in formal attire smiling warmly"
    },
    {
      name: "Pastor Sarah Johnson",
      role: "Associate Pastor",
      description: "Passionate about youth ministry and community outreach programs.",
      image: "Female associate pastor in professional attire"
    },
    {
      name: "Elder Michael Brown",
      role: "Church Elder",
      description: "Providing spiritual guidance and oversight to our church family.",
      image: "Church elder in suit with kind expression"
    },
    {
      name: "Deacon Lisa Davis",
      role: "Worship Leader",
      description: "Leading our congregation in heartfelt worship and praise.",
      image: "Worship leader with musical instruments in background"
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - GraceLife Mission International</title>
        <meta name="description" content="Learn about GraceLife Mission International's history, mission, vision, and leadership. Discover our Christ-centered values and commitment to spreading God's love." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img  
            className="w-full h-full object-cover opacity-20" 
            alt="Church building exterior with beautiful architecture"
           src="https://images.unsplash.com/photo-1485492816591-c7e7c8bd5b2a" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              About Our Church
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Discover the heart and soul of GraceLife Mission International - a community built on faith, love, and service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
                Our <span className="gradient-text">Story</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Founded in 2009, GraceLife Mission International began as a small gathering of believers with a big vision - to create a church where everyone could experience God's amazing grace regardless of their background or circumstances.
                </p>
                <p>
                  What started with just 20 members in a rented community center has grown into a thriving congregation of over 500 active members. Our journey has been marked by God's faithfulness and the dedication of countless individuals who have contributed to our mission.
                </p>
                <p>
                  Today, we continue to be a beacon of hope in our community, reaching out to those in need and spreading the Gospel message of love, redemption, and eternal life through Jesus Christ.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img  
                    className="w-full h-48 object-cover rounded-lg shadow-lg" 
                    alt="Church members volunteering in community"
                   src="https://images.unsplash.com/photo-1694286066866-4324f80d7906" />
                  <img  
                    className="w-full h-32 object-cover rounded-lg shadow-lg" 
                    alt="Children in Sunday school"
                   src="https://images.unsplash.com/photo-1598399392489-40405ee16303" />
                </div>
                <div className="space-y-4 mt-8">
                  <img  
                    className="w-full h-32 object-cover rounded-lg shadow-lg" 
                    alt="Church choir singing"
                   src="https://images.unsplash.com/photo-1559128530-539fd7dced85" />
                  <img  
                    className="w-full h-48 object-cover rounded-lg shadow-lg" 
                    alt="Church baptism ceremony"
                   src="https://images.unsplash.com/photo-1681936480327-50c4bbd5784b" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Mission & <span className="gradient-text">Vision</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                To spread the Gospel of Jesus Christ and build a strong faith community through worship, discipleship, and service. We are committed to helping every person discover their purpose in God's kingdom and equipping them to make a positive impact in the world.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                To be a transformative force in our community and beyond, where lives are changed, families are restored, and hope is renewed through the power of God's love. We envision a world where everyone has the opportunity to experience God's grace and live out their divine calling.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Our Core <span className="gradient-text">Values</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These fundamental principles guide everything we do as a church community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <value.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Our <span className="gradient-text">Leadership</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the dedicated leaders who guide our church with wisdom, compassion, and unwavering faith.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
              >
                <div className="relative h-64">
                  <img  
                    className="w-full h-full object-cover" 
                    alt={`${leader.name} - ${leader.role}`}
                   src="https://images.unsplash.com/photo-1595956553066-fe24a8c33395" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{leader.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{leader.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{leader.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              God's Faithfulness in Numbers
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              See how God has blessed our ministry over the years.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "Active Members" },
              { number: "15", label: "Years of Ministry" },
              { number: "50+", label: "Baptisms This Year" },
              { number: "12", label: "Ministry Programs" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
