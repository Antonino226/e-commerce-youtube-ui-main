import { Component, OnInit } from '@angular/core';
import { SpecialOfferService } from '../_services/specialoffer.service';
import { SpecialOffer } from '../_model/specialoffer';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  // Video paths
  videos: string[] = [
    'assets/videos/background1.mp4',
    'assets/videos/background2.mp4',
    'assets/videos/background3.mp4',
    // Add more video paths if necessary
  ];

  specialOffers: SpecialOffer[] = [];
  currentOfferIndex = 0;
  offerDisplayDuration = 10000; // Display each offer for 10 seconds

  constructor(private specialOfferService: SpecialOfferService) { }

  ngOnInit(): void {
    // Set an interval to change the video every intervalTime milliseconds
    setInterval(this.changeVideo.bind(this), this.intervalTime);

    // Fetch special offers on component initialization
    this.specialOfferService.getSpecialOffers().subscribe(offers => {
      this.specialOffers = offers;
      // Start cycling through offers if any exist
      if (this.specialOffers.length > 0) {
        setInterval(this.changeOffer.bind(this), this.offerDisplayDuration);
      }
    });
  }

  // Function to change the video
  changeVideo() {
    const videoElement = document.getElementById('background-video') as HTMLVideoElement;
    const sourceElement = document.getElementById('video-source') as HTMLSourceElement;

    sourceElement.src = this.videos[this.currentVideoIndex];
    videoElement.load();
    this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videos.length;
  }

  // Function to change the current offer
  changeOffer() {
    this.currentOfferIndex = (this.currentOfferIndex + 1) % this.specialOffers.length;
  }

  // Interval time to change the video (in milliseconds)
  intervalTime = 60000; // Every minute for test, change to 3600000 for every hour

  // Current video index
  currentVideoIndex = 0;

  // Handle video end event
  handleVideoEnded() {
    this.changeVideo();
  }

  get currentOffer(): SpecialOffer {
    return this.specialOffers[this.currentOfferIndex];
  }
  
}
