import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { AuthService } from '../auth/auth.service';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from '../auth/firebase-config';  // Import Firebase config
import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, NgIf, HttpClientModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  data: any;
  error: boolean | undefined;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) {
    // Create a reactive form with email and password controls
    this.authService.getUidData().subscribe(
      (response) => {
        console.log('Received data:', response);
        this.data = response; // Store the received data
        this.error = false; // Reset any error state
        console.log(this.error);
      },
      (error) => {
        console.error('Error:', error);
        this.error = true; // Set the error flag to true in case of failure
        console.log(this.error);
      }
    );
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Getter for easy access to form fields in the template
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).then(
        (response: any) => {
          console.log('Login successful', response);
          this.errorMessage = "";
          // Handle successful login (e.g., store token, navigate to dashboard)
        },
        (error : any) => {
          console.error('Login failed', error);
          this.errorMessage = error.messagingSenderId;
        }
      );
    }
  }
  
  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
