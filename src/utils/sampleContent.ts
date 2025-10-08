// Sample content generator for template previews
import type { InvitationContent, HeroContent, StoryContent, EventDetails, GalleryContent, GiftContent, ClosingContent, BrideGroomDetailsContent, SacredTextContent, CountdownContent, WishesContent } from '../types';

export const generateSampleContent = (templateId: string): InvitationContent => {
  const baseContent: InvitationContent = {
    heroSection: {
      title: 'Dengan Hormat, Kami Mengundang Bapak/Ibu/Saudara/i',
      subtitle: 'Untuk Menghadiri Resepsi Pernikahan Kami',
      coupleNames: ['Pengantin Pria', 'Pengantin Wanita']
    },
    eventDetails: {
      ceremony: {
        name: 'Acara Pernikahan',
        date: new Date('2024-07-15T10:00:00'),
        time: '10:00 WIB',
        venue: 'Gedung Pernikahan Indah',
        address: 'Jl. Cinta Sejati No. 123, Jakarta Selatan'
      }
    }
  };

  // Customize content based on template category
  switch (templateId) {
    case 'modern-elegance':
    case 'romantic-garden':
    case 'classic-wedding':
      return {
        ...baseContent,
        heroSection: {
          title: 'Dengan Hormat, Kami Mengundang Bapak/Ibu/Saudara/i',
          subtitle: 'Untuk Menghadiri Resepsi Pernikahan Kami',
          coupleNames: ['Budi Santoso', 'Ani Putri']
        },
        brideGroomDetailsSection: {
          title: 'Mempelai',
          bride: {
            fullName: 'Anindya Putri Handayani',
            nickname: 'Ani',
            instagram: '@anindya_putri',
            childOrder: 2,
            fatherName: 'Bapak Suparman',
            motherName: 'Ibu Surtinah',
            profileImage: '', // Using decorative placeholder instead of actual image
            bio: 'Seorang wanita yang ceria, penyayang, dan memiliki semangat tinggi dalam menjalani kehidupan. Bekerja sebagai desainer grafis dan memiliki passion dalam seni.'
          },
          groom: {
            fullName: 'Budi Santoso',
            nickname: 'Budi',
            instagram: '@budi_santoso',
            childOrder: 1,
            fatherName: 'Bapak Slamet Riyadi',
            motherName: 'Ibu Siti Aminah',
            profileImage: '', // Using decorative placeholder instead of actual image
            bio: 'Seorang pria yang bertanggung jawab, humoris, dan selalu siap membantu orang lain. Bekerja sebagai software engineer dan memiliki passion dalam teknologi.'
          }
        },
        storySection: {
          title: 'Kisah Cinta Kami',
          timeline: [
            {
              id: '1',
              date: 'Musim Semi 2019',
              title: 'Pertemuan Pertama',
              description: 'Kami bertemu di sebuah kedai kopi dekat kampus. Ani sedang membaca buku favoritnya, dan Budi tidak bisa menahan diri untuk memulai percakapan tentang sastra. Percakapan santai yang berubah menjadi jam-jam obrolan mendalam.',
              image: '' // Using decorative placeholder instead of actual image
            },
            {
              id: '2',
              date: 'Musim Panas 2020',
              title: 'Kencan Pertama',
              description: 'Kencan resmi pertama kami adalah piknik di Taman Suropati. Kami menghabiskan berjam-jam berbicara di bawah bintang-bintang dan tahu ini adalah sesuatu yang istimewa.',
              image: '' // Using decorative placeholder instead of actual image
            },
            {
              id: '3',
              date: 'Musim Dingin 2022',
              title: 'Lamaran',
              description: 'Di bawah langit malam yang berbintang di taman favorit kami, Budi berlutut dan mengajukan pertanyaan yang mengubah segalanya. Ani langsung mengatakan ya dengan air mata kebahagiaan di matanya.',
              image: '' // Using decorative placeholder instead of actual image
            },
            {
              id: '4',
              date: 'Musim Semi 2024',
              title: 'Perencanaan Masa Depan',
              description: 'Kami mulai merencanakan pernikahan impian kami, bersemangat memulai babak baru kehidupan kami bersama. Setiap detail direncanakan dengan penuh cinta dan perhatian.',
              image: '' // Using decorative placeholder instead of actual image
            }
          ]
        },
        eventDetails: {
          ceremony: {
            name: 'Akad Nikah',
            date: new Date('2024-06-15T10:00:00'),
            time: '10:00 WIB',
            venue: 'Masjid Al-Ikhlas',
            address: 'Jl. Kebahagiaan No. 45, Jakarta Selatan 12345',
            dressCode: 'Pakaian resmi',
            notes: 'Mohon datang 15 menit sebelum acara dimulai. Acara akan diselenggarakan di dalam ruangan.',
            coordinates: {
              lat: -6.2088,
              lng: 106.8456
            }
          },
          reception: {
            name: 'Resepsi Pernikahan',
            date: new Date('2024-06-15T13:00:00'),
            time: '13:00 - 17:00 WIB',
            venue: 'Ballroom Grand Palace',
            address: 'Jl. Resepsi Indah No. 67, Jakarta Selatan 12346',
            dressCode: 'Pakaian resmi',
            notes: 'Makan malam dan tarian menyusul. Bar terbuka tersedia sampai pukul 16:30.',
            coordinates: {
              lat: -6.2102,
              lng: 106.8471
            }
          }
        },
        sacredTextSection: {
          title: 'Ayat Suci',
          text: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu merasa tenang dan tentram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.',
          source: 'QS. Ar-Rum: 21',
          isIslamic: true,
          reference: 'Al-Qur\'an'
        },
        gallerySection: {
          title: 'Perjalanan Kami Bersama',
          images: [
            {
              id: '1',
              url: '', // Using decorative placeholder instead of actual image
              caption: 'Liburan pertama kami bersama di Bali',
              thumbnail: '' // Using decorative placeholder instead of actual image
            },
            {
              id: '2', 
              url: '', // Using decorative placeholder instead of actual image
              caption: 'Merayakan kelulusan bersama',
              thumbnail: '' // Using decorative placeholder instead of actual image
            },
            {
              id: '3',
              url: '', // Using decorative placeholder instead of actual image
              caption: 'Petualangan akhir pekan di pegunungan',
              thumbnail: '' // Using decorative placeholder instead of actual image
            },
            {
              id: '4',
              url: '', // Using decorative placeholder instead of actual image
              caption: 'Kumpul keluarga saat liburan',
              thumbnail: '' // Using decorative placeholder instead of actual image
            },
            {
              id: '5',
              url: '', // Using decorative placeholder instead of actual image
              caption: 'Menari di bawah bintang-bintang',
              thumbnail: '' // Using decorative placeholder instead of actual image
            },
            {
              id: '6',
              url: '', // Using decorative placeholder instead of actual image
              caption: 'Berjalan-jalan di pantai saat matahari terbenam',
              thumbnail: '' // Using decorative placeholder instead of actual image
            },
            {
              id: '7',
              url: '', // Using decorative placeholder instead of actual image
              caption: 'Memasak bersama di rumah',
              thumbnail: '' // Using decorative placeholder instead of actual image
            },
            {
              id: '8',
              url: '', // Using decorative placeholder instead of actual image
              caption: 'Petualangan di sekitar kota',
              thumbnail: '' // Using decorative placeholder instead of actual image
            }
          ],
          layout: 'masonry'
        },
        giftSection: {
          title: 'Amplop Digital & Hadiah',
          subtitle: 'Kehadiran Anda adalah hadiah terbesar bagi kami',
          message: 'Kami sangat bersyukur atas doa dan dukungan Anda. Jika Anda ingin memberikan kontribusi untuk awal baru kami atau mengirimkan hadiah, berikut adalah detailnya:',
          showBankAccounts: true,
          showEwallets: true,
          showShippingAddress: true,
          bankAccounts: [
            {
              id: 'bca-1',
              bankName: 'Bank Central Asia (BCA)',
              accountNumber: '1234567890',
              accountName: 'Budi Santoso'
            },
            {
              id: 'mandiri-1',
              bankName: 'Bank Mandiri',
              accountNumber: '9876543210',
              accountName: 'Ani Putri'
            }
          ],
          ewallets: [
            {
              id: 'gopay-1',
              provider: 'GoPay',
              phoneNumber: '081234567890',
              accountName: 'Budi Santoso'
            },
            {
              id: 'ovo-1',
              provider: 'OVO',
              phoneNumber: '081298765432',
              accountName: 'Ani Putri'
            },
            {
              id: 'dana-1',
              provider: 'DANA',
              phoneNumber: '081211112222',
              accountName: 'Budi Santoso'
            }
          ],
          shippingAddress: {
            recipientName: 'Budi & Ani',
            address: 'Jl. Kebahagiaan No. 123, RT 01 RW 02',
            city: 'Jakarta Selatan',
            province: 'DKI Jakarta',
            postalCode: '12345',
            country: 'Indonesia',
            phoneNumber: '081234567890',
            notes: 'Silakan koordinasikan waktu pengiriman melalui WhatsApp. Kami biasanya ada di rumah pada sore hari.'
          }
        },
        countdownSection: {
          title: 'Hitung Mundur Acara',
          targetEvent: 'ceremony',
          message: 'Kami menantikan kehadiran Anda di hari istimewa kami'
        },
        wishesSection: {
          title: 'Ucapan & Doa',
          subtitle: 'Kirimi kami doa dan ucapan terbaik untuk hari istimewa kami',
          message: 'Setiap ucapan dan doa dari Anda sangat berarti bagi kami. Terima kasih sudah meluangkan waktu untuk mengirimkan pesan terbaik.',
          showForm: true,
          showEntries: true,
          entriesPerPage: 4
        },
        closingSection: {
          title: 'Penutup',
          message: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.',
          gratitudeMessage: 'Tanpa kehadiran dan doa restu dari keluarga serta sahabat sekalian, pernikahan kami bukanlah apa-apa. Terima kasih telah menjadi bagian dari hari bahagia kami.',
          includeThankYou: true,
          signatureNames: ['Budi Santoso', 'Ani Putri']
        }
      };

    case 'birthday-celebration':
      return {
        ...baseContent,
        heroSection: {
          title: 'Anda Diundang!',
          subtitle: 'Bergabunglah dalam perayaan ulang tahun',
          coupleNames: ['Ulang Tahun Emma yang ke-25']
        },
        eventDetails: {
          ceremony: {
            name: 'Pesta Ulang Tahun',
            date: new Date('2024-06-20T19:00:00'),
            time: '19:00 WIB',
            venue: 'Ballroom Pesta',
            address: 'Jl. Kebahagiaan No. 789, Kota Perayaan',
            notes: 'Datanglah siap untuk berpesta dan merayakan!'
          }
        },
        gallerySection: {
          title: 'Kenangan Ulang Tahun',
          images: [
            {
              id: '1',
              url: '', // Using decorative placeholder instead of actual image
              caption: 'Perayaan ulang tahun sebelumnya'
            },
            {
              id: '2',
              url: '', // Using decorative placeholder instead of actual image
              caption: 'Waktu menyenangkan dengan teman-teman'
            }
          ],
          layout: 'carousel'
        }
      };

    case 'corporate-event':
      return {
        ...baseContent,
        heroSection: {
          title: 'Anda Diundang',
          subtitle: 'untuk menghadiri acara perusahaan kami',
          coupleNames: ['Konferensi Tahunan 2024']
        },
        eventDetails: {
          ceremony: {
            name: 'Konferensi Perusahaan',
            date: new Date('2024-08-10T09:00:00'),
            time: '09:00 WIB',
            venue: 'Pusat Konferensi',
            address: 'Jl. Bisnis No. 100, Kota Metro',
            dressCode: 'Pakaian bisnis',
            notes: 'Silakan bawa kartu nama Anda dan bersiaplah untuk berjejaring!'
          }
        }
      };

    default:
      return baseContent;
  }
};