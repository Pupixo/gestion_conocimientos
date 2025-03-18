import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GestionCursoService {
  private table = new Subject<any[]>();
  private mensajeCambio = new Subject<string>();  
  urlMain: string = `${environment.apiBase}gestion_curso/`

  constructor(
    protected http: HttpClient,
  ) {}

  converttopdf(t: FormData) {
    return this.http.post<any>(`${this.urlMain}search/`, t);
  }

  searchFiles(query: any) {
    return this.http.get<any[]>(`${this.urlMain}search/${query}/`);
  }

  ListarArchivos(){
    return this.http.get<any[]>(`${this.urlMain}ruta-archivo`);
  }

  listar(){
    return this.http.get<any[]>(this.urlMain)
  }

  listarPorId(id: number){
    return this.http.get<any>(`${this.urlMain}${id}/`);
  }
 
  listarEst(){
    return this.http.get<any[]>(this.urlMain)
  }

  setValidation(data: any[]){
    this.table.next(data);
  }

  getValidation(){
    return this.table.asObservable();
  }

  setMensajeCambio(mensaje: string){
    this.mensajeCambio.next(mensaje);
  }

  listarPorIdTicketDetalle(id: number){
    return this.http.get<any[]>( `${this.urlMain}listar-id/?id=${id}`)
  }

  RegistrarDetalleTicket(t: FormData){
    return this.http.post(`${this.urlMain}insertar-detalle/`, t);
  }

  listarRol(){
    return this.http.get<any[]>(this.urlMain)
  }


  //Curso


  // contenido
  registrarContenido(t: FormData){
    return this.http.post(`${this.urlMain}contenido-curso/`, t);
  }
  EditarContenidoCurso(t: FormData, id: number){
    return this.http.put(`${this.urlMain}contenido-curso-update/${id}/`, t);
  }
  listarPorcontenidobyCurso(id_curso: number){
    return this.http.get<any>(`${this.urlMain}contenido-curso/${id_curso}/`);
  }
  EliminarContenidoCursp(id_contenido: number): Observable<any> {
    return this.http.delete<any>(`${this.urlMain}contenido-curso/${id_contenido}/`);
  }
  
  // listarPorcontenidobyId(pk: number){
  //   return this.http.get<any>(`${this.urlMain}contenido-curso-id/${pk}/`);
  // }



  // temas
  registrarTemasContenido(t: FormData){
    return this.http.post(`${this.urlMain}contenido-tema/`, t);
  }
  EditarTemasContenido(t: FormData, id: number){
    return this.http.put(`${this.urlMain}contenido-tema/${id}/`, t);
  }
  listarPorTemaByType(id: number, type: string): Observable<any> {
    return this.http.get<any>(`${this.urlMain}contenido-tema/${type}/${id}/`);
  }
  EliminarTema(id: number) {
      return this.http.delete<any>(`${this.urlMain}contenido-tema/${id}/`);
  }



  //temas archivo
  listarPorArchivoTemaByType(id: number, type: string): Observable<any> {
    return this.http.get<any>(`${this.urlMain}archivo-tema/${type}/${id}/`);
  }
  EliminarArchivoTema(id_archivo_contenido: number) {
      return this.http.delete<any>(`${this.urlMain}archivo-tema/${id_archivo_contenido}/`);
  }









  

  //examen_curso 
  //ListExamenCurso examen_curso 
  ListExamenCurso(type: string,id:number): Observable<any> {
    return this.http.get<any>(`${this.urlMain}examen_curso/${type}/${id}/`);
  }
  // Create a new examen_curso
  registrarExamenCurso(t: FormData): Observable<any> {
    return this.http.post<any>(`${this.urlMain}examen_curso/`, t);
  }

  // Update an existing examen_curso
  EditarExamenCurso(t: FormData, id: number): Observable<any> {
    return this.http.put<any>(`${this.urlMain}examen_curso/${id}/`, t);
  }
  // Get a specific examen_curso by ID
  ExamenCursoId(pk: number): Observable<any> {
    return this.http.get<any>(`${this.urlMain}examen_curso/${pk}/`);
  }
  // Delete a examen_curso by ID
  EliminarExamenCursoId(id_curso: number): Observable<any> {
    return this.http.delete<any>(`${this.urlMain}examen_curso/${id_curso}/`);
  }



  //preguntas-examen-curso
  //listar preguntas-examen-curso
  ListPreguntasExamenCurso(type: string,id:number): Observable<any> {
    return this.http.get<any>(`${this.urlMain}preguntas-examen-curso/${type}/${id}/`);
  }
  // Create a new preguntas-examen-curso
  registrarPreguntasExamenCurso(t: FormData): Observable<any> {
    return this.http.post<any>(`${this.urlMain}preguntas-examen-curso/`, t);
  }
  // Update an existing preguntas-examen-curso
  EditarPreguntasExamenCurso(t: FormData, id: number): Observable<any> {
    return this.http.put<any>(`${this.urlMain}preguntas-examen-curso/${id}/`, t);
  }
  // Get a specific preguntas-examen-curso by ID
  PreguntasExamenCursoContenidoId(pk: number): Observable<any> {
    return this.http.get<any>(`${this.urlMain}preguntas-examen-curso/${pk}/`);
  }
  //eliminar preguntas-examen-curso 
  EliminarPreguntasExamenCursoId(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlMain}preguntas-examen-curso/${id}/`);
  }



  




  //quiz 
  ListQuizContenido(type: string,id:number): Observable<any> {
    return this.http.get<any>(`${this.urlMain}quiz/${type}/${id}/`);
  }
  // Create a new quiz
  registrarQuizContenido(t: FormData): Observable<any> {
    return this.http.post<any>(`${this.urlMain}quiz/`, t);
  }
  // Update an existing quiz
  EditarQuizContenido(t: FormData, id: number): Observable<any> {
    return this.http.put<any>(`${this.urlMain}quiz/${id}/`, t);
  }
  // Get a specific quiz by ID
  QuizContenidoId(pk: number): Observable<any> {
    return this.http.get<any>(`${this.urlMain}quiz/${pk}/`);
  }

  // Delete a quiz by ID
  EliminarQuizContenidoId(id_contenido: number): Observable<any> {
    return this.http.delete<any>(`${this.urlMain}quiz/${id_contenido}/`);
  }




  //preguntas
  //listar preguntas
  ListPreguntasContenido(type: string,id:number): Observable<any> {
    return this.http.get<any>(`${this.urlMain}preguntas/${type}/${id}/`);
  }
  // Create a new preguntas
  registrarPreguntasContenido(t: FormData): Observable<any> {
    return this.http.post<any>(`${this.urlMain}preguntas/`, t);
  }
  // Update an existing preguntas
  EditarPreguntasContenido(t: FormData, id: number): Observable<any> {
    return this.http.put<any>(`${this.urlMain}preguntas/${id}/`, t);
  }
  // Get a specific preguntas by ID
  PreguntsContenidoId(pk: number): Observable<any> {
    return this.http.get<any>(`${this.urlMain}preguntas/${pk}/`);
  }
  //eliminar pregunta
  EliminarPreguntasContenidoId(id_contenido: number): Observable<any> {
    return this.http.delete<any>(`${this.urlMain}preguntas/${id_contenido}/`);
  }



  
  //notas_examen 
  //ListExamenCurso notas_examen 
  ListaNotasExamen(type: string,id:number): Observable<any> {
    return this.http.get<any>(`${this.urlMain}notas_examen/${type}/${id}/`);
  }
  // Create a new notas_examen
  registrarNotasExamen(t: FormData): Observable<any> {
    return this.http.post<any>(`${this.urlMain}notas_examen/`, t);
  }
  // Update an existing notas_examen
  EditarNotasExamen(t: FormData, id: number): Observable<any> {
    return this.http.put<any>(`${this.urlMain}notas_examen/${id}/`, t);
  }
  // Get a specific notas_examen by ID
  NotasExamenId(pk: number): Observable<any> {
    return this.http.get<any>(`${this.urlMain}notas_examen/${pk}/`);
  }
  // Delete a notas_examen by ID
  EliminarNotasExamenId(id_curso: number): Observable<any> {
    return this.http.delete<any>(`${this.urlMain}notas_examen/${id_curso}/`);
  }






  //curso usuario
  //listar cursosusaruio
  ListCursoUsuario(type: string,id:string): Observable<any> {
    return this.http.get<any>(`${this.urlMain}curso_usuario/${type}/${id}/`);
  }
  // Create 
  registrarAccionesCursoUsuario(t: FormData): Observable<any> {
    return this.http.post<any>(`${this.urlMain}curso_usuario/`, t);
  }
  // Update 
  editarAccionesCursoUsuario(t: FormData, id: any): Observable<any> {
    return this.http.put<any>(`${this.urlMain}curso_usuario/${id}/`, t);
  }

  //listar cursosusaruio
  ListCursoIdEstadistica(pk:string): Observable<any> {
    return this.http.get<any>(`${this.urlMain}estadistica_resumen/${pk}/`);
  }
  
}
