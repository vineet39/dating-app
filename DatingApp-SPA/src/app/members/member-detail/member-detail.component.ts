import { Component, OnInit, Input } from '@angular/core';
import { Users } from '_models/users';
import { AlertifyService } from '_services/alertify.service';
import { UserService } from '_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @Input() user: Users;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  private readonly newProperty = 'user';

  constructor(private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    // this.loadUser();
    this.route.data.subscribe(data => {
      this.user = data[this.newProperty];
    });

    this.galleryOptions = [
      {
          width: '500px',
          height: '500px',
          thumbnailsColumns: 4,
          imageAnimation: NgxGalleryAnimation.Slide,
          imagePercent: 100,
          preview: false

      }
  ];
    this.galleryImages = this.getImages();
  }

  loadUser() {
    this.userService.getUser(+this.route.snapshot.params.id).subscribe((value: Users) => {
      this.user = value;
    }, (error: any) => {
      this.alertify.error('Some error');
    });
  }

  getImages() {
    const imgageUrls = [];
    imgageUrls.push({
        small: 'https://media.gq.com/photos/5ddc068cf9da7100098924e0/16:9/w_2560%2Cc_limit/KKW-SKIMS-Shapewear-for-Men-GQ-2019-112519.jpg',
        medium: 'https://media.gq.com/photos/5ddc068cf9da7100098924e0/16:9/w_2560%2Cc_limit/KKW-SKIMS-Shapewear-for-Men-GQ-2019-112519.jpg',
        big: 'https://media.gq.com/photos/5ddc068cf9da7100098924e0/16:9/w_2560%2Cc_limit/KKW-SKIMS-Shapewear-for-Men-GQ-2019-112519.jpg'
    }, {
      small: 'https://media.gq.com/photos/5ddc068cf9da7100098924e0/16:9/w_2560%2Cc_limit/KKW-SKIMS-Shapewear-for-Men-GQ-2019-112519.jpg',
      medium: 'https://media.gq.com/photos/5ddc068cf9da7100098924e0/16:9/w_2560%2Cc_limit/KKW-SKIMS-Shapewear-for-Men-GQ-2019-112519.jpg',
      big: 'https://media.gq.com/photos/5ddc068cf9da7100098924e0/16:9/w_2560%2Cc_limit/KKW-SKIMS-Shapewear-for-Men-GQ-2019-112519.jpg'
  }
  );
    return imgageUrls;
  }

}

