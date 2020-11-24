import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Photo } from '_models/Photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from '_services/auth.service';
import { AlertifyService } from '_services/alertify.service';
import { UserService } from '_services/user.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentMain: Photo;
  constructor(private authService: AuthService, private alertify: AlertifyService, private userService: UserService) {}

  ngOnInit() {
    this.initialUploader();
  }
  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  initialUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false; };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      this.photos.push(JSON.parse(response));
      this.alertify.success('Photo uploaded successfully');
    };
  }
  setPhotoAsMain(photo: Photo) {
    this.userService.setPhotoAsMain(photo.id).subscribe(() => {
      this.alertify.success('Successfully updated main photo');
      this.currentMain = this.photos.filter(p => p.isMain === true)[0];
      this.currentMain.isMain = false;
      photo.isMain = true;
      this.getMemberPhotoChange.emit(photo.url);
    }, (error: any) => {
      this.alertify.error(error.error);
    });
  }
  deletePhoto(photo: Photo) {
    this.userService.deletePhoto(photo.id, this.authService.decodedToken.nameid).subscribe(() => {
      this.alertify.success('Successfully deleted photo');
      this.photos = this.photos.filter(p => p.id !== photo.id);
    }, (error: any) => {
      this.alertify.error(error.error);
    });
  }
}
