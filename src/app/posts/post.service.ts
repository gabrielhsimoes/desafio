import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { NewPost, Post } from './post.model';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private post: Post[] = [];
  private url = environment.api;
  private defaultUserId = 10; // ID do usuário padrão, no caso o 10


  constructor(private httpClient: HttpClient) {
    this.loadPosts(); // Carregar posts ao inicializar o serviço
  }

  // Carregar posts do localStorage ou API
  private loadPosts(): void {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      this.post = JSON.parse(savedPosts); // Restaurar posts do localStorage
    } else {
      // Se não houver posts no localStorage, buscar da API
      this.getPostsFromApi();
    }
  }

  // Método para buscar posts da API e combinar com os locais
  private getPostsFromApi() {
    this.httpClient.get<Post[]>(`${this.url}/posts`).subscribe((posts) => {
      this.post = [...this.post, ...posts]; // Combinar posts da API com os locais
      this.savePosts(); // Salvar no localStorage
    });
  }

  // Método para buscar os posts locais
  getPosts(): Observable<Post[]> {
    return new Observable<Post[]>((observer) => {
      observer.next(this.post); // Retorna os posts locais já carregados
    });
  }

  // Método para criar posts e salvar no localStorage
  createPosts(post: NewPost): Observable<Post> {
    return this.httpClient.post<Post>(this.url + '/posts', post).pipe(
      tap((createdPost) => {
        this.post.push(createdPost); // Adicionar o post à lista local
        this.savePosts(); // Salvar no localStorage
      })
    );
  }

  // Método para pegar um post por ID
  getUserPost(postId: number) {
    return this.post.filter((post) => post.id === postId);
  }

  // Método para atualizar um post localmente e no localStorage
  updatePost(postId: number, updatedPost: Post): void {
    const index = this.post.findIndex((post) => post.id === postId);
    if (index !== -1) {
      this.post[index] = updatedPost; // Atualiza o post na lista local
      this.savePosts(); // Salva no localStorage
    }
  }

  // Método para salvar os posts no localStorage
  private savePosts(): void {
    localStorage.setItem('posts', JSON.stringify(this.post)); // Salvar posts no localStorage
  }

    // Método para buscar o nome do usuário
    getUserName(userId: number): Observable<string> {
      return this.httpClient.get<any>(`${this.url}/users/${userId}`).pipe(
        map((user) => user.username) // Utilizando o map para extrair o 'username'
      );
    }

    // Método para excluir um post, tanto na API quanto localmente
deletePost(postId: number): Observable<void> {
  return this.httpClient.delete<void>(`${this.url}/posts/${postId}`).pipe(
    tap(() => {
      // Remove o post da lista local
      const index = this.post.findIndex((post) => post.id === postId);
      if (index !== -1) {
        this.post.splice(index, 1); // Remove o post localmente
        this.savePosts(); // Atualiza o localStorage
      }
    })
  );
}


}
