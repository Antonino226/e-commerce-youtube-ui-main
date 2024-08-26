import { Component, OnInit } from '@angular/core';
import { SpecialOfferService } from '../_services/specialoffer.service';
import { SpecialOffer } from '../_model/specialoffer';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  videos: string[] = [
    'assets/videos/background1.mp4',
    'assets/videos/background2.mp4',
    'assets/videos/background3.mp4',
  ];

  specialOffers: SpecialOffer[] = [];
  currentOfferIndex = 0;
  offerDisplayDuration = 10000; // 10 seconds

  isLoading = true; // Spinner control
  currentVideoIndex = 0;
  intervalTime = 60000; // Change video every 60 seconds

  constructor(private specialOfferService: SpecialOfferService) { }

  ngOnInit(): void {
    // Fetch special offers on component initialization
    this.specialOfferService.getSpecialOffers().subscribe(offers => {
      this.specialOffers = offers;
      if (this.specialOffers.length > 0) {
        setInterval(this.changeOffer.bind(this), this.offerDisplayDuration);
      }
    });

    setInterval(this.changeVideo.bind(this), this.intervalTime);
  }

  // Change video function
  changeVideo() {
    this.isLoading = true; // Show spinner when video changes
    const videoElement = document.getElementById('background-video') as HTMLVideoElement;
    const sourceElement = document.getElementById('video-source') as HTMLSourceElement;

    sourceElement.src = this.videos[this.currentVideoIndex];
    videoElement.load();
    this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videos.length;
  }

  // Handle when the video is fully buffered and can be played
  onVideoCanPlay() {
    const videoElement = document.getElementById('background-video') as HTMLVideoElement;
    this.isLoading = false; // Hide spinner when video is fully loaded
    videoElement.play(); // Start video playback
  }

  // Handle video loading errors
  onVideoError() {
    console.error("Error loading video");
    this.isLoading = false; // Hide spinner if there's an error
  }

  // Handle waiting for video to load
  onVideoWaiting() {
    this.isLoading = true; // Show spinner while the video buffers
  }

  // Change offer function
  changeOffer() {
    this.currentOfferIndex = (this.currentOfferIndex + 1) % this.specialOffers.length;
  }

  get currentOffer(): SpecialOffer {
    return this.specialOffers[this.currentOfferIndex];
  }

}
