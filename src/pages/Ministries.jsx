
import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Users, Heart, BookOpen, Star, Baby, Music, HeartHandshake as Handshake, Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Ministries = () => {
  const { toast } = useToast();

  const handleJoinMinistry = (ministryName) => {
    toast({
      title: "🚧 Ministry Registration Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const ministries = [
    {
      id: 1,
      title: "Youth Ministry",
      subtitle: "Ages 13-25",
      description: "Empowering the next generation with faith, purpose, and community through engaging programs, mentorship, and service opportunities.",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      image: "Energetic youth group gathering with young people laughing and studying Bible",
      features: [
        "Weekly youth services",
        "Summer camps and retreats",
        "Mentorship programs",
        "Community service projects",
        "Leadership development"
      ],
      leader: "Pastor Sarah Johnson",
      meetingTime: "Fridays 7:00 PM"
    },
    {
      id: 2,
      title: "Women's Ministry",
      subtitle: "Sisters in Faith",
      description: "Building sisterhood and spiritual growth through Bible studies, fellowship events, and mutual support in life's journey.",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      image: "Women of different ages studying Bible together in warm fellowship setting",
      features: [
        "Weekly Bible studies",
        "Monthly fellowship dinners",
        "Prayer circles",
        "Retreat weekends",
        "Mentoring relationships"
      ],
      leader: "Deacon Mary Williams",
      meetingTime: "Thursdays 10:00 AM"
    },
    {
      id: 3,
      title: "Men's Ministry",
      subtitle: "Men of Valor",
      description: "Strengthening men to lead with godly character, integrity, and purpose in their families, work, and community.",
      icon: BookOpen,
      color: "from-green-500 to-emerald-500",
      image: "Men in discussion group studying scripture and sharing fellowship",
      features: [
        "Monthly breakfast meetings",
        "Men's retreats",
        "Accountability groups",
        "Service projects",
        "Father-son activities"
      ],
      leader: "Elder Michael Brown",
      meetingTime: "First Saturday 7:00 AM"
    },
    {
      id: 4,
      title: "Children's Ministry",
      subtitle: "Little Lights",
      description: "Nurturing young hearts with age-appropriate Bible lessons, fun activities, and a foundation of faith that will last a lifetime.",
      icon: Baby,
      color: "from-yellow-500 to-orange-500",
      image: "Happy children in colorful Sunday school classroom learning about Jesus",
      features: [
        "Sunday school classes",
        "Vacation Bible School",
        "Children's choir",
        "Family fun events",
        "Holiday programs"
      ],
      leader: "Teacher Jennifer Davis",
      meetingTime: "Sundays 9:00 AM"
    },
    {
      id: 5,
      title: "Worship Ministry",
      subtitle: "Voices of Praise",
      description: "Leading our congregation in heartfelt worship through music, song, and creative expression that honors God.",
      icon: Music,
      color: "from-purple-500 to-violet-500",
      image: "Worship team with instruments and singers leading congregation in praise",
      features: [
        "Sunday worship leading",
        "Choir rehearsals",
        "Special music events",
        "Instrument training",
        "Songwriting workshops"
      ],
      leader: "Deacon Lisa Davis",
      meetingTime: "Wednesdays 7:00 PM"
    },
    {
      id: 6,
      title: "Outreach Ministry",
      subtitle: "Hands of Hope",
      description: "Spreading God's love throughout our community through service, evangelism, and meeting practical needs.",
      icon: Star,
      color: "from-red-500 to-pink-500",
      image: "Church volunteers serving meals and helping community members in need",
      features: [
        "Food bank distribution",
        "Community events",
        "Prison ministry",
        "Hospital visits",
        "Homeless outreach"
      ],
      leader: "Deacon Robert Johnson",
      meetingTime: "Saturdays 9:00 AM"
    },
    {
      id: 7,
      title: "Seniors Ministry",
      subtitle: "Golden Years",
      description: "Honoring our elders with fellowship, spiritual growth, and opportunities to share their wisdom with younger generations.",
      icon: Handshake,
      color: "from-indigo-500 to-blue-500",
      image: "Senior adults enjoying fellowship and Bible study in comfortable setting",
      features: [
        "Weekly fellowship meetings",
        "Senior trips and outings",
        "Wisdom sharing sessions",
        "Health and wellness programs",
        "Intergenerational activities"
      ],
      leader: "Elder Patricia Smith",
      meetingTime: "Tuesdays 2:00 PM"
    },
    {
      id: 8,
      title: "Missions Ministry",
      subtitle: "Global Impact",
      description: "Supporting missionaries worldwide and organizing mission trips to spread the Gospel across cultures and nations.",
      icon: Globe,
      color: "from-teal-500 to-green-500",
      image: "Mission team serving in international community with local people",
      features: [
        "International mission trips",
        "Missionary support",
        "Cultural exchange programs",
        "Fundraising events",
        "Prayer for nations"
      ],
      leader: "Pastor John Smith",
      meetingTime: "Monthly Planning"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Ministries - GraceLife Mission International</title>
        <meta name="description" content="Discover ministry opportunities at GraceLife Mission International. Join our youth, women's, men's, children's, worship, outreach, and missions ministries." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img  
            className="w-full h-full object-cover opacity-20" 
            alt="Diverse group of people serving in various church ministries"
           src="https://images.unsplash.com/photo-1647456614166-40dedca18fca" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Our Ministries
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Discover your place to serve, grow, and make a difference in our church family and community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ministry Overview */}
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
              Find Your <span className="gradient-text">Calling</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              At GraceLife Mission International, we believe every person has unique gifts and talents that God wants to use for His glory. 
              Our diverse ministries provide opportunities for spiritual growth, fellowship, and service at every stage of life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-blue-50 rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Grow Together</h3>
              <p className="text-gray-600">Build meaningful relationships and grow in faith alongside fellow believers.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-purple-50 rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Serve Others</h3>
              <p className="text-gray-600">Make a positive impact in our community and around the world through service.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-green-50 rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Use Your Gifts</h3>
              <p className="text-gray-600">Discover and develop your God-given talents in a supportive environment.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ministry Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {ministries.map((ministry, index) => (
              <motion.div
                key={ministry.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index % 2) * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
              >
                <div className="relative h-64">
                  <img  
                    className="w-full h-full object-cover" 
                    alt={ministry.title}
                   src="https://images.unsplash.com/photo-1564921074016-dc83ab4ac783" />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-6 left-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${ministry.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <ministry.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">{ministry.title}</h3>
                    <p className="text-white/90">{ministry.subtitle}</p>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {ministry.description}
                  </p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">What We Do:</h4>
                      <ul className="space-y-1">
                        {ministry.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-900">Leader:</span>
                        <p className="text-gray-600">{ministry.leader}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Meets:</span>
                        <p className="text-gray-600">{ministry.meetingTime}</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleJoinMinistry(ministry.title)}
                    className={`w-full bg-gradient-to-r ${ministry.color} hover:opacity-90 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 group`}
                  >
                    Join This Ministry
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ministry Leaders */}
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
              Ministry <span className="gradient-text">Leadership</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our dedicated ministry leaders are here to guide, support, and help you discover your place in God's kingdom.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Pastor John Smith",
                role: "Senior Pastor & Missions",
                image: "Senior pastor in professional attire with warm smile"
              },
              {
                name: "Pastor Sarah Johnson",
                role: "Youth & Associate Pastor",
                image: "Young female pastor with energetic and caring expression"
              },
              {
                name: "Elder Michael Brown",
                role: "Men's Ministry Leader",
                image: "Mature male church elder in suit with kind demeanor"
              },
              {
                name: "Deacon Lisa Davis",
                role: "Worship & Music Director",
                image: "Female worship leader with musical instruments in background"
              }
            ].map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="relative mb-6">
                  <img  
                    className="w-32 h-32 object-cover rounded-full mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300" 
                    alt={leader.name}
                   src="https://images.unsplash.com/photo-1595956553066-fe24a8c33395" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{leader.name}</h3>
                <p className="text-blue-600 font-medium">{leader.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Ready to Get Involved?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Don't wait to start making a difference. Join a ministry today and discover how God wants to use your unique gifts and talents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300">
                Contact Ministry Leaders
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm bg-white/10 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Visit This Sunday
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Ministries;
