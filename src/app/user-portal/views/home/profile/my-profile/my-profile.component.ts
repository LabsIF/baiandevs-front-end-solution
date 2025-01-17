import { Component } from '@angular/core';
import { MatSlideToggleModule, _MatSlideToggleRequiredValidatorModule, } from '@angular/material/slide-toggle';
import { ThemePalette } from '@angular/material/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/user-service/user.service';
import IUser from '../../../../interfaces/IUser';
import { ChangePersonalInformationModalComponent } from '../../../../components/change-personal-information-modal/change-personal-information-modal.component';
import { ChangeEmailRecoveryModalComponent } from '../../../../components/change-email-recovery-modal/change-email-recovery-modal.component';
import { ChangeEmailModalComponent } from '../../../../components/change-email-modal/change-email-modal.component';
import { ChangePasswordModalComponent } from '../../../../components/change-password-modal/change-password-modal.component';
import { SessionStorageService } from '../../../../../shared/services/session-storage/session-storage.service';
import { ToastrNotificationService } from '../../../../services/toastr/toastr.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [MatSlideToggleModule, CommonModule],
  templateUrl: './my-profile.component.html',
  providers: [
    SessionStorageService, UserService, ChangePersonalInformationModalComponent,
      ChangeEmailModalComponent, ChangePasswordModalComponent, 
      ChangeEmailRecoveryModalComponent,  ToastrNotificationService],
  styleUrl: './my-profile.component.css',
})
export class MyProfileComponent {
  color: ThemePalette = 'primary';
  flagRememberPasswordChange: boolean = false;
  defaultProfilePhoto: string = '../../../../../../../src/assets/images/shared/profile-photo.svg';
  userProfile: IUser = {}
  acessToken: string = '';

  constructor(
    private userService: UserService,
    private sessionStorageService: SessionStorageService,
    private changePersonalInformationModalComponent: ChangePersonalInformationModalComponent,
    private changeEmailModalComponent: ChangeEmailModalComponent,
    private changePasswordModalComponent: ChangePasswordModalComponent, 
    private changeEmailRecoveryModalComponent: ChangeEmailRecoveryModalComponent,
    private toarstNotification: ToastrNotificationService,
  ) {
    this.initialize();
  }
  
  async initialize() {

    this.acessToken = this.sessionStorageService.getSessionToken() as string;
    
    await this.isFlagRememberPasswordChangeEnable();

    if(this.acessToken){
      this.getProfileData();
    }
  }

  openChangePersonalInformationModal() {
    this.changePersonalInformationModalComponent.openDialog();
  }
  openChangeEmailRecoveryModalComponent() {
    this.changeEmailRecoveryModalComponent.openDialog();
  }


  openChangeEmailModal() {
    this.changeEmailModalComponent.openDialog();
  }

  openChangePasswordModal() {
    this.changePasswordModalComponent.openDialog();
  }

  getProfileData(): void {
    this.userService
      .getUserData(this.acessToken)
      .toPromise()
      .then((response: HttpResponse<IUser> | any) => {
        if (response?.status == 200 || response?.status == 201) {

          this.userProfile.name = response.body.name;
          this.userProfile.email = response.body.email;
          this.userProfile.profile_photo = response.body.profile_photo;
          this.userProfile.email_recovery = response.body.email_recovery;
          this.userProfile.cpf_cnpj = response.body.cpf_cnpj;
          this.userProfile.phone_number = response.body.phone_number;

          if (
            response.body.profile_photo == null ||
            response.body.profile_photo == '' ||
            response.body.profile_photo == undefined
          ) {
            this.userProfile.profile_photo = this.defaultProfilePhoto;
          }

          this.userProfile.phone_number = response.body.phone_number;
        }
      })
      .catch((error: HttpErrorResponse) => {
        
        if (error.status >= 400 && error.status < 500) {
          console.error(error.error.error);
        }

        if (error.status >= 500) {
          console.error('Erro interno no servidor.');
        }

        this.userProfile.name = 'Default';
        this.userProfile.email = '';
        this.userProfile.profile_photo = this.defaultProfilePhoto;
        this.userProfile.phone_number = '';
      });
  }
  setCheckBoxValueFlagValueRememberPasswordChange(flagValue: boolean) {
    this.flagRememberPasswordChange = flagValue;
  }

  async checkBoxFlagValueRememberPasswordChangeClick() {
    this.flagRememberPasswordChange = !this.flagRememberPasswordChange;
    await this.setFlagValueRememberPasswordChange();
  }

  async setFlagValueRememberPasswordChange(): Promise<void> {
    await this.userService
      .setFlagValueRememberPasswordChange(this.acessToken, this.flagRememberPasswordChange)
      .toPromise()
      .then((response: HttpResponse<any> | any) => {
        if (response?.status == 200 || response?.status == 201) {
          this.toarstNotification.showSuccess('Flag alterada com sucesso', 'Sucesso');
        }
      })
      .catch((error: HttpErrorResponse) => {

        this.toarstNotification.showError('Erro ao alterar flag', 'Erro');
        console.error(error);
      });
  }

  async isFlagRememberPasswordChangeEnable(){

    await this.userService
      .isFlagRememberPasswordChangeEnable(this.acessToken)
      .toPromise()
      .then((response: HttpResponse<any> | any) => {
        if (response?.status == 200 || response?.status == 201) {
          this.flagRememberPasswordChange = response.body.isFlagEnable;
        }
      })
      .catch((error: HttpErrorResponse) => {
        
        this.toarstNotification.showError('Erro ao obter flag', 'Erro');

        console.error(error);

      });
  }

  uploadProfilePhoto(event: any) {
  }
}
