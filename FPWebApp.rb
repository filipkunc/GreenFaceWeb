require 'sinatra'
require 'json'
require 'base64'
require 'sequel'

class FPWebApp < Sinatra::Base
  set :root, File.dirname(__FILE__)

	before do
		@DB = Sequel.connect(ENV['DATABASE_URL'] || 'sqlite://db/levels.db')
	end

  get '/' do
		@levels = @DB[:levels].order(:id)
    erb :home
  end

	get '/leveleditor' do
		levelParam = params["level"]
		redirect "/leveleditor.html?level=#{levelParam}.xml"
	end

	get '/game/level/*.xml' do |name|
		redirect "/game.html?level=#{name}.xml"
	end
	
	get '/Levels/*.xml' do |name|
		headers "Content-Type" => "text/xml; charset=utf8"
		level = @DB[:levels][:title => name]
		return level[:data]
	end
	
	post '/Levels/*.xml' do |name|
		data = request.body.read
		level = @DB[:levels][:title => name]
		if level != nil
			@DB[:levels].filter(:id => level[:id]).update(:data => data)
		else
			@DB[:levels].insert(:title => name, :data => data)
		end
		
		# File.open(File.dirname(__FILE__) + "/public/Levels/#{name}.xml", 'w') { |f| f.write request.body.read }		
	end

end

