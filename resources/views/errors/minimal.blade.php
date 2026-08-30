@extends('errors.layout')

@section('title')
@yield('code') — @yield('message')
@endsection

@section('code')
@yield('code')
@endsection

@section('heading')
@yield('code')
@endsection

@section('message')
@yield('message')
@endsection
