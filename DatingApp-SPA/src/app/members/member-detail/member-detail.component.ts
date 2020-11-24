import { Component, OnInit, Input } from '@angular/core';
import { Users } from '_models/users';
import { AlertifyService } from '_services/alertify.service';
import { UserService } from '_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { Photo } from '_models/Photo';

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
    for (const photo in this.user.photos) {
      if (photo != null) {
        imgageUrls.push({
          small: this.user.photos[photo].url,
          medium: this.user.photos[photo].url,
          big: this.user.photos[photo].url
        });
      }
    }
    return imgageUrls;
  }

}

