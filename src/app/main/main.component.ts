import { Component, OnInit } from '@angular/core';
import { MainService } from './main.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  imageToShow: any;
  isImageLoading = false;
  bgColor = 'rgb(255,255,255)';

  constructor(protected mainService: MainService) {}

  ngOnInit() {
    this.getImageFromService();
  }

  getImageFromService() {
    this.isImageLoading = true;
    this.mainService
      .getImage('https://pbs.twimg.com/media/D6n_pI_WwAUAbKp.jpg')
      .subscribe(
        data => {
          this.createImageFromBlob(data);
          this.isImageLoading = false;
        },
        error => {
          this.isImageLoading = false;
          console.log(error);
        }
      );
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.imageToShow = reader.result;
        this.updateBgColor();
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  updateBgColor() {
    const img = new Image();
    img.src = this.imageToShow;
    img.onload = event => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const width = (canvas.width = img.naturalWidth);
      const height = (canvas.height = img.naturalHeight);

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      let r = 0;
      let g = 0;
      let b = 0;

      for (let i = 0, l = data.length; i < l; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }

      r = Math.floor(r / (data.length / 4));
      g = Math.floor(g / (data.length / 4));
      b = Math.floor(b / (data.length / 4));

      this.bgColor = 'rgb(' + r + ',' + g + ',' + b + ')';
    };
  }
}
